const { CardSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateCreateCard(req, res, next) {
  return ValidationHandlerUtil.validate(CardSchemas.createCardSchema, req, next);
}

module.exports = {
  validateCreateCard,
};
