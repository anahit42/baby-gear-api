const config = require('config');
const JWT = require('jsonwebtoken');
const jwtSecret = config.get('jwt.secret');
const jwtOptions = config.get('jwt.options');
const sendErrorResponse = require('../utils');
const HttpStatus = require('http-status-codes');
const jwt = config.get('jwt');

async function createUserToken(userId, email, role) {
  return JWT.sign({ _id: userId, email: email, role: role },
    jwtSecret,
    jwtOptions);
}

// FOR TESTING ONLY
async function createAdminToken(adminCode) {
  return JWT.sign({ adminCode: adminCode },
    jwtSecret,
    jwtOptions);
}

async function checkLoginToken(res, userId, authorization) {
  const decoded = await JWT.verify(authorization, jwt.secret);

  if (userId !== decoded._id.toString()) {
    sendErrorResponse(res, HttpStatus.UNAUTHORIZED, HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED));
  }
}

async function checkAdminToken(res, authorization) {
  const decoded = await JWT.verify(authorization, jwt.secret);

  if (decoded.adminCode.toString() !== jwt.adminCode) {
    sendErrorResponse(res, HttpStatus.FORBIDDEN, HttpStatus.getStatusText(HttpStatus.FORBIDDEN));
  }

}

module.exports = {
  createUserToken,
  checkLoginToken,
  checkAdminToken,
  createAdminToken };
