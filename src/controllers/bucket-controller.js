const { BucketModel, ProductModel } = require('../models');
const { NotFoundError, ValidationError } = require('../errors');

const { ResponseHandlerUtil } = require('../utils');

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
      throw new NotFoundError('Not found');
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
  addProductToBucket,
};
