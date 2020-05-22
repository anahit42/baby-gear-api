const HttpStatus = require('http-status-codes');

const CryptoLib = require('../libs/crypto-lib');
const TokenLib = require('../libs/token-lib');

const { NotFoundError, ConflictError } = require('../errors');
const { UserModel } = require('../models');
const { USER_ROLES } = require('../constants');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const matches = await CryptoLib.comparePassword(password, user.password);

    if (!matches) {
      throw new NotFoundError('User not found.');
    }

    const token = await TokenLib.createUserToken({ _id: user._id, email, role: user.role });

    return res.status(HttpStatus.OK).json({
      data: {
        _id: user._id,
        email,
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function register(req, res, next) {
  try {
    const { email } = req.body;

    const user = await UserModel.exists({ email });

    if (user) {
      throw new ConflictError('This user already exists, please try another one.');
    }

    const {
      firstName,
      lastName,
      password,
      mobilePhone,
      address,
    } = req.body;

    const passwordHash = await CryptoLib.hashPassword(password);

    await UserModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      mobilePhone,
      address,
      isActive: true,
    });

    return res.status(HttpStatus.OK).json({ data: { email } });
  } catch (error) {
    return next(error);
  }
}

async function registerAdmin(req, res, next) {
  try {
    const { email } = req.body;
    const user = await UserModel.exists({ email });

    if (user) {
      throw new ConflictError('This user already exists, please try another one.');
    }

    const { adminToken } = req.headers;

    TokenLib.checkAdminToken(adminToken);

    const {
      firstName,
      lastName,
      password,
      mobilePhone,
      address,
    } = req.body;

    const passwordHash = await CryptoLib.hashPassword(password);

    await UserModel.create({
      firstName,
      lastName,
      role: USER_ROLES.ADMIN,
      email,
      password: passwordHash,
      mobilePhone,
      address,
      isActive: true,
    });

    return res.status(HttpStatus.OK).json({ data: { email } });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  register,
  registerAdmin,
};
