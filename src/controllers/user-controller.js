const JWT = require('jsonwebtoken');
const config = require('config');

const jwt = config.get('jwt');

const { UserModel } = require('../models');
const CryptoLib = require('../libs/crypto-lib');
const { ForbiddenError } = require('../errors');

function removeUndefinedValues(object) {
  Object.keys(object).forEach(key => !object[key] && delete object[key]);
  return object;
}

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

async function updateUser(req, res, next) {

  const { userId } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {

    const allFields = {
      firstName, lastName, email, password
    };

    const updateFields = removeUndefinedValues(allFields);

    if (password) {
      const passwordHash = await CryptoLib.hashPassword(password);
      updateFields.password = passwordHash;
    }

    if (userId !== req.userData._id) {
      throw new ForbiddenError('Not Authorized!');
    }
    if(email) {
      const existUser = await UserModel.findOne({ email });
      if (existUser) {
        throw new ForbiddenError('Not Authorized!');
      }
    }

    await UserModel.updateOne({_id: userId}, updateFields);

    return res.status(200).json({
      body: 'User Updated!'
    });

  } catch (error) {
    return next(error);
  }

}
module.exports = {
  getUser,
  updateUser
};
