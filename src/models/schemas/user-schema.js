const mongoose = require('mongoose');
const UserRole = require('../../constants');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: [UserRole.Admin, UserRole.User],
    default: UserRole.User
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
  },
  isActive: Boolean
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = UserSchema;
