const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const { UserModel } = require('../models');

async function login (req, res) {
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

  const options = { expiresIn: 300 };
  const token = await JWT.sign({ id: user.id, email: user.email }, process.env.SECRET, options);

  return res.status(200).json({
    email,
    token
  });
}

module.exports = {
  login
};
