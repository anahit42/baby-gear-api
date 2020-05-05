const JWT = require('jsonwebtoken');
const config = require('config');

const jwt = config.get('jwt');

const { UserModel } = require('../models');
const CryptoLib = require('../libs/crypto-lib');

async function createUser (req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;

    const  passwordHash = await CryptoLib.hashPassword(password);

    await UserModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash
    });

    return res.status(200).json({ email });
  } catch (error) {
    return next(error);
  }
}

async function getUser (req, res, next) {
  const { userId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, jwt.secret);

    if (userId !== decoded.id.toString()) {
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

module.exports = {
  createUser,
  getUser,
};
