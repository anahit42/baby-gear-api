const CustomError = require('./custom-error');

class ConflictError extends CustomError {
  constructor(message) {
    super({
      message,
      status: 409
    });
  }
}

module.exports = ConflictError;
