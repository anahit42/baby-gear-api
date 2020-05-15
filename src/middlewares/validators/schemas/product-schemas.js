const Joi = require('@hapi/joi');

const productIdSchemas = Joi.object({
  params: Joi.object({
    productId: Joi.string().hex().length(24)
  })
});

module.exports = {
  productIdSchemas
};
