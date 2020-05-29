const StripeLib = require('../libs/stripe-lib');
const { TransactionModel, OrderModel, ProductModel } = require('../models/index');

async function updateProductStatus(lines) {
  try {
    // Loop through invoice items
    lines.data.forEach(async (invoiceItem) => {
      const { orderId } = invoiceItem.metadata;
      const { invoiceQuantity } = invoiceItem;

      const productId = await OrderModel.findById(orderId, 'productId');
      const { status, quantity } = await ProductModel.findById(productId, 'status quantity');

      if (status === 'active' && parseInt(quantity, 10) - parseInt(invoiceQuantity, 10) <= 0) {
        ProductModel.updateOne(
          { _id: productId },
          { status: 'not-available' }
        );
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function updateInvoices() {
  try {
    // TODO: Add limit and skip.
    const invoices = await StripeLib.getInvoices({});

    invoices.data.forEach((invoice) => {
      const { id, lines, status, paid } = invoice;

      TransactionModel.findByIdAndUpdate(
        { invoiceId: id },
        { paid, status }
      );

      if (paid) {
        updateProductStatus(lines);
      }
    });
  } catch (error) {
    // TODO: Log error.
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

module.exports = {
  updateInvoices,
};
