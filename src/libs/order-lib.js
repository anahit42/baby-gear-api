const config = require('config');

const StripeLib = require('./stripe-lib');
const PaymentLib = require('./payment-lib');

const { BucketModel, ProductModel, OrderModel, InvoiceModel } = require('../models');

const stripeCurrency = config.get('stripeCurrency');

class OrderLib {
  static getInvoiceItemsData(lines) {
    return lines.data.reduce((invoiceItems, line) => {
      const { id, amount, metadata } = line;

      invoiceItems.push({
        invoiceItemId: id,
        amount,
        metadata,
      });

      return invoiceItems;
    }, []);
  }

  static async updateBucket(payload) {
    const { userId, productIds, decreaseAmount } = payload;
    return BucketModel.findOneAndUpdate({ userId }, {
      $pull: {
        products: { productId: { $in: productIds } },
      },
      $inc: {
        totalPrice: -decreaseAmount,
      },
    });
  }

  static async createOrderAndInvoice(payload) {
    try {
      const { userId, productId, quantity, quantityToBuy, paymentCustomerId, price, productDoc } = payload;

      const order = {
        ownerId: userId,
        productId,
        quantity,
      };

      const createdOrder = await OrderModel.create(order);
      const orderId = createdOrder._id.toString();

      await StripeLib.createInvoiceItem({
        customerId: paymentCustomerId,
        currency: stripeCurrency,
        amount: price * quantity,
        description: `Order ${orderId} payment invoice`,
        metadata: { orderId },
      });

      productDoc.quantity -= quantityToBuy;
      await productDoc.save();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  }

  static async createOrdersAndInvoiceItems(payload) {
    const { products, userId, paymentCustomerId } = payload;

    const failedProducts = { decreaseAmount: 0, productIds: [] };
    const productsToBuy = { decreaseAmount: 0, products: [] };

    await Promise.map(products, async (product) => {
      try {
        const { productId } = product;
        const quantityToBuy = product.quantity;

        const productDoc = await ProductModel.findOne({ _id: productId });

        if (!productDoc) {
          failedProducts.productIds.push({ productId });
          return;
        }

        const { status, price, quantity } = productDoc;

        if (status !== 'active' || quantity < quantityToBuy) {
          failedProducts.productIds.push({ productId });
          failedProducts.decreaseAmount += quantityToBuy * price;
          return;
        }

        productsToBuy.products.push({ productId, quantity, quantityToBuy, price, productDoc });
        productsToBuy.decreaseAmount += quantityToBuy * price;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error.message);
      }
    });

    if (failedProducts.productIds.length) {
      await OrderLib.updateBucket({
        userId,
        productIds: failedProducts.productIds,
        decreaseAmount: failedProducts.decreaseAmount,
      });
    }

    if (productsToBuy.products.length) {
      await Promise.map(productsToBuy.products, async (product) => {
        const { productId, quantity, quantityToBuy, price, productDoc } = product;

        return OrderLib.createOrderAndInvoice({
          userId,
          productId,
          quantity,
          quantityToBuy,
          paymentCustomerId,
          price,
          productDoc,
        });
      });

      await OrderLib.updateBucket({
        userId,
        productIds: productsToBuy.products.map((el) => el.productId),
        decreaseAmount: productsToBuy.decreaseAmount,
      });
    }
  }

  static async createInvoice(payload) {
    const { paymentMethodId, paymentCustomerId, userId } = payload;
    const method = await PaymentLib.getUserPaymentMethod({ paymentMethodId, userId });

    const invoice = await StripeLib.createInvoice({
      paymentMethodId: method.methodId,
      customerId: paymentCustomerId,
    });

    const { lines, amount_due: totalPrice, id, paid, status } = invoice;
    const items = OrderLib.getInvoiceItemsData(lines);

    return InvoiceModel.create({
      userId,
      invoiceId: id,
      totalPrice,
      items,
      status,
      paid,
    });
  }
}

module.exports = OrderLib;
