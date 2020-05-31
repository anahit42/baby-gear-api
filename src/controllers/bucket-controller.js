const { BucketModel } = require('../models');
const { ForbiddenError, NotFoundError } = require('../errors');

const { ResponseHandlerUtil } = require('../utils');

async function getBucket(req, res, next) {
  const { userId } = req.params;
  try {
    if (userId !== req.userData._id) {
      throw new ForbiddenError('You\'re not allowed to view this resource');
    }
    const userBucket = await BucketModel.findMany({ userId });

    if (!userBucket) {
      throw new NotFoundError(`Bucket for user with id = ${userId} not found.`);
    }

    return ResponseHandlerUtil.handleGet(res, userBucket);
  } catch (error) {
    return next(error);
  }
}

async function removeBucket(req, res, next) {
  const { userId } = req.params;
  try {
    if (userId !== req.userData._id) {
      throw new ForbiddenError('You\'re not allowed to view this resource');
    }
    const {
      n,
      ok,
      deletedCount,
    } = await BucketModel.deleteMany({ userId });

    if (!n) {
      throw new NotFoundError(`Bucket for user with id = ${userId} not found.`);
    }

    return ResponseHandlerUtil.handleDelete(res, { data: {
      numberOfMatchedDocs: n,
      operationIsSuccessfull: !!ok,
      deletedCount,
    } });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBucket,
  removeBucket,
};
