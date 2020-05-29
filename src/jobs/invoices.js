const Promise = require('bluebird');

const StripeLib = require('../libs/stripe-lib');
const { InvoiceModel, OrderModel, ProductModel } = require('../models');

/**
 * @param { Object } payload
 * @param { Object } payload.productId
 * @param { Object } payload.orderQuantity
 * @param { Object } payload.orderStatus
 */
async function updateProductStatus(payload) {
  try {
    const { productId, orderQuantity, orderStatus } = payload;
    const product = await ProductModel.findOne({ _id: productId }).select('quantity', 'status');
    const { quantity, status } = product;
    let total = quantity;
    let productStatus = status;

    if (orderStatus === 'failed') {
      total = quantity + orderQuantity;
    }

    if (total === 0) {
      productStatus = 'not-available';
    }

    product.quantity = total;
    product.status = productStatus;
    await product.save();
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
    return 'expired';
  case 'draft':
    return 'pending';
  default:
    return '';
  }
}

async function updateOrderInvoice(order) {
  const { _id, ownerId, productId, quantity } = order;

  const invoiceDoc = await InvoiceModel.findOne({ userId: ownerId, 'items.metadata.orderId': _id })
    .select('invoiceId');

  const { invoiceId } = invoiceDoc;

  const invoice = await StripeLib.getInvoiceById(invoiceId);
  const { status: invoiceStatus, paid } = invoice;

  invoiceDoc.paid = paid;
  invoiceDoc.status = invoiceStatus;
  order.status = mappingOrderStatus(invoiceStatus);

  await Promise.all([
    invoiceDoc.save(),
    order.save(),
  ]);

  await updateProductStatus({
    productId,
    orderStatus: order.status,
    orderQuantity: quantity,
  });
}

async function updateInvoices(job) {
  try {
    const { lastRunAt } = job.attrs;
    const orders = await OrderModel.find({
      status: 'pending',
      createdAt: { $gte: lastRunAt, $lte: Date.now() },
    });

    await Promise.map(orders, async (order) => updateOrderInvoice(order), { concurrency: 5 });
  } catch (error) {
    // TODO: Log error.
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

module.exports = {
  updateInvoices,
};
