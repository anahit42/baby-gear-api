const HttpStatus = require('http-status-codes');

const { UserModel } = require('../models');
const CryptoLib = require('../libs/crypto-lib');
const TokenLib = require('../libs/token-lib');

async function login (req, res, next) {
  try {
    const { email, password } = req.body;

    const userNotFoundError = `${UserModel.collection.collectionName} ${HttpStatus.NOT_FOUND}`;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: userNotFoundError
      });
    }

    const matches = await CryptoLib.comparePassword(password, user.password);

    if (!matches) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: userNotFoundError
      });
    }

    const token = await TokenLib.createToken();

    return res.status(HttpStatus.OK).json({
      _id: user._id,
      email,
      token
    });
  } catch (error) {
    return next(error);
  }
}

async function register (req, res, next) {
  try {
    const { firstName,
      lastName,
      role,
      email,
      password,
      mobilePhone,
      image,
      address} = req.body;

    const  passwordHash = await CryptoLib.hashPassword(password);

    await UserModel.create({
      firstName,
      lastName,
      role,
      email,
      password: passwordHash,
      mobilePhone,
      image,
      address
    });

    return res.status(HttpStatus.OK).json({ email });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  register
};
