const bcrypt = require('bcrypt');

async function hashPassword (plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

async function comparePassword (plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};
