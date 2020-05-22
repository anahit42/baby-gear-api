const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  slug: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  name: String,
  parentId: Schema.Types.ObjectId,
  description: String,
  ancestors: {
    type: [Schema.Types.ObjectId],
    index: true
  }
});

module.exports = CategorySchema;
