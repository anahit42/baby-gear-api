const { ValidationError } = require('../../errors');

function handleErrorDetails(error, next) {
  const details = error.details.reduce((acc, detail) => {
    return `${acc} ${detail.message}`;
  }, '');

  return next(new ValidationError(details));
}

module.exports = {
  handleErrorDetails,
};
