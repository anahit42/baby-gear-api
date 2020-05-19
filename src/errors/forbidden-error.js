const CustomError = require('./custom-error');
const HttpStatus = require('http-status-codes');

class ForbiddenError extends CustomError {
  constructor(message) {
    super({
      message,
      status: HttpStatus.FORBIDDEN
    });
  }
}

module.exports = ForbiddenError;
