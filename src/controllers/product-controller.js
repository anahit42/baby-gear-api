const JWT = require('jsonwebtoken');
const config = require('config');

const jwt = config.get('jwt');

const { ProductModel } = require('../models');

async function deleteProduct (req, res, next) {

  const { productId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, jwt.secret);

    const product = await ProductModel.findOne({ _id: productId });

    if (product.userId.toString() !== decoded._id.toString()) {
      return res.status(401).json({
        error: 'Not Authorized'
      });
    }

    await ProductModel.deleteOne({ _id: productId });

    return res.status(200).json({
      'message':'Product removed!'
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  deleteProduct
};
