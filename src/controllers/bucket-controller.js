const Promise = require('bluebird');

const { BucketModel, ProductModel } = require('../models');
const { ForbiddenError, NotFoundError, ValidationError } = require('../errors');
const { ResponseHandlerUtil } = require('../utils');
const OrderLib = require('../libs/order-lib');

async function getBucket(req, res, next) {
  const { userId } = req.params;
  try {
    if (userId !== req.userData._id) {
      throw new ForbiddenError('You\'re not allowed to view this resource');
    }
    const userBucket = await BucketModel.findOne({ userId }).populate('products.productId');
    if (!userBucket) {
      throw new NotFoundError(`Bucket for user with id = ${userId} not found.`);
    }

    return ResponseHandlerUtil.handleGet(res, userBucket);
  } catch (error) {
    return next(error);
  }
}

async function removeBucket(req, res, next) {
  const { productIds } = req.body;
  const { userId } = req.params;
  try {
    if (userId !== req.userData._id) {
      throw new ForbiddenError('You\'re not allowed to view this resource');
    }
    const prductsRemoveFromBucket = await BucketModel.findOne({ userId }).populate('products.productId');
    if (prductsRemoveFromBucket.products.length) {
      let decreaseAmount = 0;
      await Promise.map(prductsRemoveFromBucket.products, async (product) => {
        decreaseAmount += product.productId.price * product.quantity;
      });
      await OrderLib.updateBucket({
        userId,
        productIds,
        decreaseAmount,
      });
    }

    return ResponseHandlerUtil.handleDelete(res, { data: {
      prductsRemoveFromBucket } });
  } catch (error) {
    return next(error);
  }
}

async function addProductToBucket(req, res, next) {
  const { productId, quantity } = req.body;
  const { userId: paramsUserId } = req.params;
  const userId = req.userData._id;

  if (paramsUserId !== userId) {
    throw new ValidationError('User is not allowed to do this action');
  }

  try {
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.quantity < quantity) {
      throw new ValidationError('Product not available in that quantity');
    }

    const currentBucketData = await BucketModel.findOne({ userId });
    if (!currentBucketData) {
      const createData = {
        userId,
        products: [{
          productId,
          quantity,
        }],
        totalPrice: quantity * product.price,
      };
      const bucketDoc = await BucketModel.create(createData);
      return ResponseHandlerUtil.handleCreate(res, bucketDoc);
    }

    const pickedProduct = currentBucketData.products.find(
      (prod) => prod.productId.toString() === productId
    );

    const increaseAmount = product.price * quantity;
    if (pickedProduct) {
      pickedProduct.quantity += quantity;
      currentBucketData.totalPrice += increaseAmount;
    } else {
      currentBucketData.products.push({ productId, quantity });
      currentBucketData.totalPrice += increaseAmount;
    }

    const bucketData = await currentBucketData.save();

    return ResponseHandlerUtil.handleCreate(res, bucketData);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBucket,
  removeBucket,
  addProductToBucket,
};
