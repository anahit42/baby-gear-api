const config = require('config');
const JWT = require('jsonwebtoken');

const HttpStatus = require('http-status-codes');
const { ForbiddenError } = require('../errors');

const adminToken = config.get('admin.token');
const jwtSecret = config.get('jwt.secret');
const jwtOptions = config.get('jwt.options');

async function createUserToken(userInfo) {
  const { _id, email, role } = userInfo;

  return JWT.sign({ _id, email, role }, jwtSecret, jwtOptions);
}

function checkAdminToken(token) {
  if (token !== adminToken) {
    throw new ForbiddenError(HttpStatus.getStatusText(HttpStatus.FORBIDDEN));
  }
}

module.exports = {
  createUserToken,
  checkAdminToken,
};
