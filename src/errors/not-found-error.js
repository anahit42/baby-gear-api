const CustomError = require('./custom-error');
const HttpStatus = require('http-status-codes');

class NotFoundError extends CustomError {
  constructor(message) {
    super({
      message,
      status: HttpStatus.NOT_FOUND
    });
  }
}

module.exports = NotFoundError;
