const JWT = require('jsonwebtoken');
const config = require('config');

const jwt = config.get('jwt');

const { UserModel } = require('../models');

async function getUser(req, res, next) {
  const { userId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, jwt.secret);

    if (userId !== decoded._id.toString()) {
      return res.status(401).json({
        error: 'Not Authorized'
      });
    }

    const user = await UserModel.findOne({ _id: userId }).select({
      password: 0,
      email: 0,
      mobilePhone: 0,
      address: 0
    });

    return res.status(200).json({
      user
    });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  let { limit } = 0;
  let { skip } = 0;

  for (let key in req.query) {
    limit = parseInt(req.query.limit);
    skip = parseInt(req.query.skip);
    console.log(key, req.query[key]);
  }

  try {
    const users = await UserModel.find({}).select({
      password: 0,
      email: 0,
      mobilePhone: 0,
      address: 0
    }).limit(limit).skip(skip);

    const total = await UserModel.countDocuments({});

    users.push({ 'total': total });

    return res.status(200).json({
      users
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUser,
  getUsers
};
