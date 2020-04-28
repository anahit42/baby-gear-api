const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const { UserModel } = require('../models');

async function createUser (req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    const  passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash
    });

    return res.status(200).json({
      user
    });
  } catch (error) {
    console.log(error);

    return  res.status(400).json({
      error: error.message
    });
  }
}

async function getUser (req, res) {
  const { userId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, process.env.SECRET);

    if (userId !== decoded.id.toString()) {
      return res.status(401).json({
        error: 'Not Authorized'
      });
    }

    const user = await UserModel.findOne({ _id: userId }).select({
      password: 0
    });

    return res.status(200).json({
      user
    });
  } catch (error) {
    console.log(error);

    return  res.status(400).json({
      error: error.message
    });
  }

}

async function getUsers (req, res) {
  const { userId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = await JWT.verify(authorization, process.env.SECRET);

    if (userId !== decoded.id.toString()) {
      return res.status(401).json({
        error: 'Not Authorized'
      });
    }

    return res.status(200).json({
      decoded
    });
  } catch (error) {
    console.log(error);

    return  res.status(400).json({
      error: error.message
    });
  }

}

module.exports = {
  createUser,
  getUser,
  getUsers
};
