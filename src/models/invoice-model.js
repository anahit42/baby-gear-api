const mongoose = require('mongoose');

const { InvoiceSchema } = require('./schemas');

const InvoiceModel = mongoose.model('Invoice', InvoiceSchema);

module.exports = InvoiceModel;
