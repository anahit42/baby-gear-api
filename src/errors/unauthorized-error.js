const HttpStatus = require('http-status-codes');
const CustomError = require('./custom-error');

class UnAuthorizedError extends CustomError {
  constructor(message) {
    super({
      message,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}

module.exports = UnAuthorizedError;
