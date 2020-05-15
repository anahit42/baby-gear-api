const JWT = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwt.secret');
const { UnAuthorizedError } = require('../errors');
const HttpStatus = require('http-status-codes');

async function authorize (req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnAuthorizedError(HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED));
    }

    req.userData = await JWT.verify(authorization, jwtSecret);

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  authorize
};
