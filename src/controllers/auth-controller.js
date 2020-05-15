const HttpStatus = require('http-status-codes');

const { UserModel } = require('../models');
const CryptoLib = require('../libs/crypto-lib');
const TokenLib = require('../libs/token-lib');
const Utils = require('../utils');
const AdminRole = require('../constants').Admin;

const notFound = HttpStatus.NOT_FOUND;
const conflict = HttpStatus.CONFLICT;
const duplicateUserError = 'This user already exists, please try another one.';
const userNotFoundError = `${UserModel.collection.collectionName} ${notFound}`;


async function login (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return Utils.sendErrorResponse(res, notFound, userNotFoundError);
    }

    const matches = await CryptoLib.comparePassword(password, user.password);

    if (!matches) {
      return Utils.sendErrorResponse(res, notFound, userNotFoundError);
    }

    const token = await TokenLib.createUserToken(user._id, email, user.role);
    // FOR TESTING ONLY
    const adminToken = await TokenLib.createAdminToken('babygearadmin');
    return res.status(HttpStatus.OK).json({
      _id: user._id,
      email,
      token,
      //FOR TESTING ONLY
      adminToken
    });
  } catch (error) {
    return next(error);
  }
}

async function register (req, res, next) {
  try {

    const { email } = req.body;

    const user = await checkIfUserExists(email);
    if (user) {
      return Utils.sendErrorResponse(res, conflict, duplicateUserError);
    }

    const { firstName,
      lastName,
      role,
      password,
      mobilePhone,
      address} = req.body;

    const  passwordHash = await CryptoLib.hashPassword(password);

    await UserModel.create({
      firstName,
      lastName,
      role,
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
    const user = await checkIfUserExists(email);
    if (user) {
      return Utils.sendErrorResponse(res, conflict, duplicateUserError);
    }

    const { authorization } = req.headers;

    await TokenLib.checkAdminToken(res, authorization);

    const { firstName,
      lastName,
      password,
      mobilePhone,
      address} = req.body;

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

async function checkIfUserExists(email) {
  const user = await UserModel.findOne({ email });
  console.log(user);

  return user;
}

module.exports = {
  login,
  register,
  registerAdmin
};


