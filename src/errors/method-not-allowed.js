const HttpStatus = require('http-status-codes');
const CustomError = require('./custom-error');

class MethodNotAllowedError extends CustomError {
  constructor(message) {
    super({
      message,
      status: HttpStatus.METHOD_NOT_ALLOWED,
    });
  }
}

module.exports = MethodNotAllowedError;
