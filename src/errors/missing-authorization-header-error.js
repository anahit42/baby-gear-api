const CustomError = require('./custom-error');
const HttpStatus = require('http-status-codes');

class MissingAuthorizationHeaderError extends CustomError {
  constructor(message) {
    super({
      message,
      status: HttpStatus.UNAUTHORIZED
    });
  }
}

module.exports = MissingAuthorizationHeaderError;
