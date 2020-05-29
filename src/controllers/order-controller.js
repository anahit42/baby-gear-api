const Promise = require('bluebird');
const config = require('config');
const { OrderModel, InvoiceModel, ProductModel, BucketModel, UserModel } = require('../models');
const { NotFoundError } = require('../errors');
const { ResponseHandlerUtil } = require('../utils');
const StripeLib = require('../libs/stripe-lib');
// const { getUserPaymentMethod } = require('../libs/payment-lib');

const stripeCurrency = config.get('stripeCurrency');
async function getOrder(req, res, next) {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findOne({ _id: orderId });

    if (!order) {
      throw new NotFoundError('Item not found');
    }

    return ResponseHandlerUtil.handleGet(res, order);
  } catch (error) {
    return next(error);
  }
}

async function getOrders(req, res, next) {
  const { limit, skip } = req.query;
  const userId = req.userData._id;

  try {
    const [orders, total] = await Promise.all(
      OrderModel.find({ ownerId: userId }).limit(limit).skip(skip),
      OrderModel.countDocuments({ ownerId: userId })
    );

    return ResponseHandlerUtil.handleList(res, orders, total);
  } catch (error) {
    return next(error);
  }
}

async function updateBucket(userId, productId, price) {
  const bucket = await BucketModel.findOneAndUpdate({ userId }, {
    $pull: {
      products: { productId },
    },
  }, { new: true }, async (err, result) => {
    if (result) {
      result.totalPrice -= price;
      await result.save();
    }
  });
  if (!bucket) {
    throw new NotFoundError('Bucket item not found');
  }
}
function reduceInvoiceItems(lines) {
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

async function createOrder(req, res, next) {
  const { products } = req.body;
  const userId = req.userData._id;

  const { methodId } = '';// getUserPaymentMethod(req);
  let countInvoiceItem = 0;
  try {
    const user = await UserModel.findOne({ _id: userId });
    const { paymentCustomerId } = user;
    await Promise.map(products, async (product) => {
      const { productId, quantity } = product;
      const oneProduct = await ProductModel.findOne({ _id: productId, userId });
      if (!oneProduct) {
        throw new NotFoundError('Product not found');
      }
      const { status, price } = oneProduct;
      if (status !== 'active') {
        await updateBucket(userId, productId, price);
      } else {
        countInvoiceItem += 1;
        const order = {
          ownerId: userId,
          productId,
          quantity,
        };
        const createdOrder = await OrderModel.create(order);
        await StripeLib.createInvoiceItem({
          customerId: paymentCustomerId,
          currency: stripeCurrency,
          amount: price * quantity,
          description: 'test',
          metadata: { orderId: createdOrder._id.toString() },
        });
      }
    });

    if (countInvoiceItem === 0) {
      throw new NotFoundError('There is no order item');
    }
    const invoice = await StripeLib.createInvoice({
      paymentMethodId: methodId,
      customerId: paymentCustomerId,
      description: 'test invoice',
    });
    const { lines, amount_due: totalPrice, id, paid, status } = invoice;
    const items = reduceInvoiceItems(lines);
    const invoiceOurDoc = await InvoiceModel.create({
      userId,
      invoiceId: id,
      totalPrice,
      items,
      status,
      paid,
    });
    return ResponseHandlerUtil.handleCreate(res, invoiceOurDoc);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrder,
  getOrders,
  createOrder,
};
