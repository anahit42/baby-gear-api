const CustomError = require('./custom-error');

class ValidationError extends CustomError {
  constructor(message) {
    super({
      message,
      status: 400
    });

  }

}

module.exports = ValidationError;
