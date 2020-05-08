const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FavoritesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [{ type: Schema.Types.ObjectId }]
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = FavoritesSchema;
