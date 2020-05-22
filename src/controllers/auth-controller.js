const HttpStatus = require('http-status-codes');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

const { UserModel } = require('../models');
const CryptoLib = require('../libs/crypto-lib');
const TokenLib = require('../libs/token-lib');
const AdminRole = require('../constants').Admin;

const duplicateUserError = 'This user already exists, please try another one.';
const userNotFoundError = `${UserModel.collection.collectionName} ${HttpStatus.NOT_FOUND}`;


async function login (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundError(userNotFoundError);
    }

    const matches = await CryptoLib.comparePassword(password, user.password);

    if (!matches) {
      throw new NotFoundError(userNotFoundError);
    }

    const token = await TokenLib.createUserToken({ _id: user._id, email, role: user.role });

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

    const { email } = req.body;

    const user = await UserModel.exists({ email });

    if (user) {
      throw new ConflictError(duplicateUserError);
    }

    const {
      firstName,
      lastName,
      password,
      mobilePhone,
      address
    } = req.body;

    const  passwordHash = await CryptoLib.hashPassword(password);

    await UserModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      mobilePhone,
      address,
      isActive: true
    });

    return res.status(HttpStatus.OK).json({ email });
  } catch (error) {
    return next(error);
  }
}

async function registerAdmin(req, res, next) {
  try {
    const { email } = req.body;
    const user = await UserModel.exists({ email });

    if (user) {
      throw new ConflictError(duplicateUserError);
    }

    const { adminToken } = req.headers;

    TokenLib.checkAdminToken(adminToken);

    const {
      firstName,
      lastName,
      password,
      mobilePhone,
      address
    } = req.body;

    const  passwordHash = await CryptoLib.hashPassword(password);

    await UserModel.create({
      firstName,
      lastName,
      role: AdminRole,
      email,
      password: passwordHash,
      mobilePhone,
      address,
      isActive: true
    });

    return res.status(HttpStatus.OK).json({ email });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  register,
  registerAdmin
};
