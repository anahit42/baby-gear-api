const config = require('config');
const JWT = require('jsonwebtoken');
const jwtSecret = config.get('jwt.secret');
const jwtOptions = config.get('jwt.options');
const sendErrorResponse = require('../utils');
const HttpStatus = require('http-status-codes');
const ForbiddenError = require('../errors/forbidden-error');
const adminToken = config.get('admin.token');


async function createUserToken(userInfo) {

  const {
    userId,
    email,
    role
  } = userInfo;

  return JWT.sign({ _id: userId, email, role },
    jwtSecret,
    jwtOptions);
}

async function checkLoginToken(res, userId, authorization) {
  const decoded = await JWT.verify(authorization, jwt.secret);

  if (userId !== decoded._id.toString()) {
    sendErrorResponse(res, HttpStatus.UNAUTHORIZED, HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED));
  }
}

async function checkAdminToken(token) {
  if (token !== adminToken) {
    throw new ForbiddenError(HttpStatus.getStatusText(HttpStatus.FORBIDDEN));
  }
}

module.exports = {
  createUserToken,
  checkLoginToken,
  checkAdminToken
};
