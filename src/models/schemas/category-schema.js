const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  slug: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  name: String,
  parentId: Schema.Types.ObjectId,
  description: String,
  image: String,
  ancestors: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
});

module.exports = CategorySchema;
