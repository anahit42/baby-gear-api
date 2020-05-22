const HttpStatus = require('http-status-codes');
const { UnAuthorizedError } = require('../errors');

const TokenLib = require('../libs/token-lib');

async function authorize(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnAuthorizedError(HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED));
    }

    req.userData = await TokenLib.verifyToken(authorization);

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  authorize,
};
