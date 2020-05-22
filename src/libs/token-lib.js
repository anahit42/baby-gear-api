const config = require('config');
const JWT = require('jsonwebtoken');

const jwtSecret = config.get('jwt.secret');
const jwtOptions = config.get('jwt.options');
const HttpStatus = require('http-status-codes');
const ForbiddenError = require('../errors/forbidden-error');
const UnAuthorizedError = require('../errors/unauthorized-error');

const adminToken = config.get('admin.token');

async function createUserToken(userInfo) {
  const {
    _id,
    email,
    role,
  } = userInfo;

  return JWT.sign({ _id, email, role },
    jwtSecret,
    jwtOptions);
}

async function checkLoginToken(res, userId, authorization) {
  const decoded = await JWT.verify(authorization, jwtSecret);

  if (userId !== decoded._id.toString()) {
    throw new UnAuthorizedError(HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED));
  }
}

function checkAdminToken(token) {
  if (token !== adminToken) {
    throw new ForbiddenError(HttpStatus.getStatusText(HttpStatus.FORBIDDEN));
  }
}

module.exports = {
  createUserToken,
  checkLoginToken,
  checkAdminToken,
};
