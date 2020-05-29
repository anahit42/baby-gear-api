const Promise = require('bluebird');

const StripeLib = require('../libs/stripe-lib');
const { InvoiceModel, OrderModel, ProductModel } = require('../models');

/**
 * @param { Object } payload
 * @param { Object } payload.productId
 * @param { Object } payload.orderQuantity
 * @param { Object } payload.invoiceStatus
 */
async function updateProductStatus(payload) {
  try {
    const { productId, orderQuantity, invoiceStatus } = payload;
    const { productTotalQuantity, status } = await ProductModel.findOne(
      { _id: productId }
    )
      .select('quantity', 'status');

    let total = parseInt(productTotalQuantity, 10) - parseInt(orderQuantity, 10);
    let productStatus = status;

    if (!['open', 'paid'].includes(invoiceStatus)) {
      total = parseInt(productTotalQuantity, 10) + parseInt(orderQuantity, 10);
    }

    if (total === 0) {
      productStatus = 'not-available';
    }

    await ProductModel.findByIdAndUpdate(
      { _id: productId },
      { quantity: total, status: productStatus }
    );
  } catch (error) {
    throw new Error(error);
  }
}

function mappingOrderStatus(invoiceStatus) {
  switch (invoiceStatus) {
  case 'paid':
    return 'paid';
  case 'open':
    return 'pending';
  case 'uncollectible':
    return 'failed';
  case 'void':
    return 'failed';
  case 'draft':
    return 'expired';
  default:
    return '';
  }
}

async function updateInvoices(job) {
  try {
    const { lastRunAt } = job.attrs;
    const updatableOrders = await OrderModel.find({
      status: 'pending',
      createdAt: { $gte: lastRunAt, $lte: Date.now() },
    });

    await Promise.map(updatableOrders, async (order) => {
      const { _id, ownerId, productId, quantity: orderQuantity } = order;

      const { invoiceId } = await InvoiceModel.findOne(
        { userId: ownerId, 'items.metadata.orderId': _id }
      )
        .select('invoiceId');

      const invoice = await StripeLib.getInvoiceById(invoiceId);
      const { status: invoiceStatus, paid } = invoice;

      await InvoiceModel.findByIdAndUpdate(
        { invoiceId },
        { paid, status: invoiceStatus }
      );

      await OrderModel.findByIdAndUpdate(
        { _id },
        { status: mappingOrderStatus(invoiceStatus) }
      );

      await updateProductStatus({
        productId,
        orderQuantity,
        invoiceStatus,
      });
    }, { concurrency: 5 });
  } catch (error) {
    // TODO: Log error.
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

module.exports = {
  updateInvoices,
};
