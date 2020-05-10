const JWT = require('jsonwebtoken');
const config = require('config');
const HttpStatus = require('http-status-codes');

const jwt = config.get('jwt');

const { UserModel } = require('../models');

async function getUser (req, res, next) {
  const { userId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, jwt.secret);

    if (userId !== decoded.id.toString()) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
      });
    }

    const user = await UserModel.findOne({ _id: userId }).select({
      password: 0
    });

    return res.status(HttpStatus.OK).json({
      user
    });
  } catch (error) {
    return next(error);
  }

}

module.exports = {
  getUser,
};
