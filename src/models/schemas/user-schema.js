const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  role: String,
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  password: String,
});

module.exports = UserSchema;
