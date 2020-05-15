const CustomError = require('./custom-error');

class ForbiddenError extends CustomError {
  constructor(message) {
    super({
      message,
      status: 403
    });
  }
}

module.exports = ForbiddenError;