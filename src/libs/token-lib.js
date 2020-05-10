const config = require('config');
const JWT = require('jsonwebtoken');
const jwtSecret = config.get('jwt.secret');
const jwtOptions = config.get('jwt.options');

async function createToken(userId, email, role) {
  return JWT.sign({ _id: userId, email: email, role: role },
    jwtSecret,
    jwtOptions);
}

module.exports = { createToken };
