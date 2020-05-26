const HttpStatus = require('http-status-codes');
const CustomError = require('./custom-error');

class PaymentError extends CustomError {
  constructor(message, status) {
    super({
      message,
      status: status || HttpStatus.CONFLICT,
    });
  }
}

module.exports = PaymentError;
