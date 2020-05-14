const JWT = require('jsonwebtoken');
const config = require('config');

const jwt = config.get('jwt');

const { UserModel } = require('../models');
const { ProductModel } = require('../models');

async function getUser (req, res, next) {
  const { userId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, jwt.secret);

    if (userId !== decoded._id.toString()) {
      return res.status(401).json({
        error: 'Not Authorized'
      });
    }

    const user = await UserModel.findOne({ _id: userId }).select({
      password: 0
    });

    return res.status(200).json({
      user
    });
  } catch (error) {
    return next(error);
  }
}

async function getUserProducts (req, res, next) {
  const { userId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, jwt.secret);

    if (userId !== decoded._id.toString()) {
      return res.status(401).json({
        error: 'Not Authorized'
      });
    }

    const products = await ProductModel.find({ userId });

    return res.status(200).json({
      products
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUser,
  getUserProducts
};
