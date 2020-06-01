const { BucketModel, ProductModel } = require('../models');
const { NotFoundError, ValidationError } = require('../errors');

const { ResponseHandlerUtil } = require('../utils');

async function addProductToBucket(req, res, next) {
  const { productId, quantity } = req.body;
  const userId = req.userData._id;

  try {
    const product = await ProductModel.findOne({ _id: productId });
    const increaseAmount = product.price * quantity;

    let bucketData;

    if (!product) {
      throw new NotFoundError('Product not found');
    }
    if (product.quantity < quantity) {
      throw new ValidationError('Product not available in that quantity');
    }

    const currentBucketData = await BucketModel.findOne({ userId });
    const pickedProduct = currentBucketData.products.find(
      (prod) => prod.productId.toString() === productId.toString()
    );

    if (pickedProduct) {
      bucketData = await BucketModel.findOneAndUpdate(
        { userId, 'products.productId': pickedProduct.productId },
        {
          $set: {
            'products.$.quantity': pickedProduct.quantity + quantity,
          },
          $inc: {
            totalPrice: increaseAmount,
          },
        },
        { new: true }
      );
    } else {
      bucketData = await BucketModel.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            products: { productId, quantity },
          },
          $inc: {
            totalPrice: increaseAmount,
          },
        },
        { new: true }
      );
    }

    if (!bucketData) {
      throw new NotFoundError('Not found');
    }

    return ResponseHandlerUtil.handleCreate(res, bucketData);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addProductToBucket,
};
