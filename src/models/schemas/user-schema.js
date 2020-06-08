const mongoose = require('mongoose');

const { USER_ROLES } = require('../../constants');

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: [USER_ROLES.ADMIN, USER_ROLES.USER],
    default: USER_ROLES.USER,
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  password: String,
  mobilePhone: String,
  image: String,
  address: {
    zipCode: String,
    street: String,
    country: String,
    city: String,
  },
  shippingAddress: {
    address: Schema.Types.Mixed,
    name: String,
    phone: String,
  },
  isActive: Boolean,
  paymentCustomerId: String,
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = UserSchema;
