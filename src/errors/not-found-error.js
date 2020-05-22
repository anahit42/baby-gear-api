const HttpStatus = require('http-status-codes');
const CustomError = require('./custom-error');

class NotFoundError extends CustomError {
  constructor(message) {
    super({
      message,
      status: HttpStatus.NOT_FOUND,
    });
  }
}

module.exports = NotFoundError;
