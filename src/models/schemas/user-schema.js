const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  password: String,
  mobilePhone: String,
  image: String,
  address: {
    zipCode: String,
    street: String,
    country: String,
    city: String
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = UserSchema;
