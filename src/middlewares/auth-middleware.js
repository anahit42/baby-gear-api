const { UnAuthorizedError } = require('../errors');

const TokenLib = require('../libs/token-lib');

class AuthMiddleware {
  static async authorize(req, res, next) {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new UnAuthorizedError('You are not authorized to perform this action.');
      }

      req.userData = await TokenLib.verifyToken(authorization);

      return next();
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AuthMiddleware;
