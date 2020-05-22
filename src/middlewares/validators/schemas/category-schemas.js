const Joi = require('@hapi/joi');

const categoryListing = Joi.object({
  query: Joi.object({
    limit: Joi.number().integer().positive(),
    skip: Joi.number().integer().positive(),
  }),
});

const categoryCreate = Joi.object({
  body: Joi.object({
    name: Joi.string().max(500).required(),
    description: Joi.string().max(500).required(),
    subCategories: Joi.array().items(Joi.object({
      name: Joi.string().max(500).required(),
      description: Joi.string().max(500).required(),
    })),
  }),
});

module.exports = {
  categoryListing,
  categoryCreate,
};
