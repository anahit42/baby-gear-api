const config = require('config');
const JWT = require('jsonwebtoken');

const jwtSecret = config.get('jwt.secret');
const jwtOptions = config.get('jwt.options');
const HttpStatus = require('http-status-codes');

const { ForbiddenError, UnAuthorizedError } = require('../errors');

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

async function verifyToken(token) {
  try {
    return await JWT.verify(token, jwtSecret);
  } catch (error) {
    throw new UnAuthorizedError('You are not authorized to perform this action.');
  }
}

function checkAdminToken(token) {
  if (token !== adminToken) {
    throw new ForbiddenError(HttpStatus.getStatusText(HttpStatus.FORBIDDEN));
  }
}

module.exports = {
  createUserToken,
  checkAdminToken,
  verifyToken,
};
