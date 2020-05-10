const CustomError = require('./custom-error');
const HttpStatus = require('http-status-codes');

class ValidationError extends CustomError {
  constructor(message) {
    super({
      message,
      status: HttpStatus.BAD_REQUEST
    });

  }

}

module.exports = ValidationError;
