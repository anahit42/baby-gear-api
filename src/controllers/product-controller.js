const { ProductModel } = require('../models');
const ValidationError = require('../errors/validation-error');
const { NotFoundError } = require('../errors');

async function getProduct (req, res, next) {
  const { productId } = req.params;

  try {
    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return res.status(200).json({
      product
    });
  } catch (error) {
    return next(error);
  }
}

async function getProducts (req,res,next) {
  const { limit, skip } = req.query;
  try {
    if(isNaN(limit) | isNaN(skip) | limit < 0 | skip < 0 | limit % 1 != 0 | skip % 1 != 0) {
      return next(new ValidationError('Invalid parameter'));
    }
    const results = {};
    results.total = await ProductModel.countDocuments();
    results.data = await ProductModel.find().limit(parseInt(limit)).skip(parseInt(skip));

    return res.status(200).json({
      results
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct
};
