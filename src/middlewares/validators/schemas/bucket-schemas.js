const Joi = require('@hapi/joi');

const bucketIdSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  }),
});

const updateBucketSchema = Joi.object({
  body: Joi.object({
    productIds: Joi.array().items(Joi.string().hex().length(24).required()),
  }),
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  }),
});

const addProductToBucketSchema = Joi.object({
  body: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().positive().required(),
  }),
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  bucketIdSchema,
  addProductToBucketSchema,
  updateBucketSchema,
};
