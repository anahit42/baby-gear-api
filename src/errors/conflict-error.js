const CustomError = require('./custom-error');
const HttpStatus = require('http-status-codes');

class ConflictError extends CustomError {
  constructor(message) {
    super({
      message,
      status: HttpStatus.CONFLICT
    });
  }
}

module.exports = ConflictError;
