const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: String,
  description: String,
  subCategories: [{
    name: String,
    description: String,
  }],
});

module.exports = CategorySchema;
