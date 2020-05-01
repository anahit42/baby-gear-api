const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const config = require('config');

const jwtSecret = config.get('jwt.secret');
const jwtOptions = config.get('jwt.options');

const { UserModel } = require('../models');

async function login (req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const matches = await bcrypt.compare(password, user.password);

    if (!matches) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const token = await JWT.sign({ id: user.id, email: user.email }, jwtSecret, jwtOptions);

    return res.status(200).json({
      email,
      token
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login
};
