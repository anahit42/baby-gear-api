const mongoose = require('mongoose');

const { BucketSchema } = require('./schemas');

const BucketModel = mongoose.model('Bucket', BucketSchema);

module.exports = BucketModel;
