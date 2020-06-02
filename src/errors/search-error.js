const HttpStatus = require('http-status-codes');
const CustomError = require('./custom-error');

class SearchError extends CustomError {
  constructor(message, status) {
    super({
      message,
      status: status || HttpStatus.SERVICE_UNAVAILABLE,
    });
  }
}

module.exports = SearchError;
