const { NotFoundError } = require('../errors');

const { ProductModel } = require('../models');

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

module.exports = {
  getProduct,
};
