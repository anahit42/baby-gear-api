const Joi = require('@hapi/joi');

const addProductToBucketSchemas = Joi.object({
  body: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().positive().required(),
  }),
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  addProductToBucketSchemas,
};
