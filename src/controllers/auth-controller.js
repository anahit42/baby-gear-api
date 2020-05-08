const JWT = require('jsonwebtoken');
const config = require('config');

const jwtSecret = config.get('jwt.secret');
const jwtOptions = config.get('jwt.options');

const { UserModel } = require('../models');
const CryptoLib = require('../libs/crypto-lib');

async function login (req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const matches = await CryptoLib.comparePassword(password, user.password);

    if (!matches) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const token = await JWT.sign({ _id: user._id, email: user.email, role: user.role }, jwtSecret, jwtOptions);

    return res.status(200).json({
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

module.exports = {
  login,
  register
};
