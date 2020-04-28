const mongoose = require('mongoose');

const { UserSchema } = require('./schemas');

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
