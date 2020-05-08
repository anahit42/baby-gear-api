const mongoose = require('mongoose');

const { CardSchema } = require('./schemas');

const CardModel = mongoose.model('Card', CardSchema);

module.exports = CardModel;
