const JWT = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwt.secret');
const { MissingAuthorizationHeaderError } = require('../errors');

async function authorize (req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      // throw custom NotAuthorizedError
      throw MissingAuthorizationHeaderError();
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
