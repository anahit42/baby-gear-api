const HttpStatus = require('http-status-codes');
const CustomError = require('./custom-error');

class ConflictError extends CustomError {
  constructor(message) {
    super({
      message,
      status: HttpStatus.CONFLICT,
    });
  }
}

module.exports = ConflictError;
