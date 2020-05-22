const Joi = require('@hapi/joi');

const { string } = Joi.types();

const categoryIdSchema = Joi.object({
  params: Joi.object({
    categoryId: string.hex().length(24).required(),
  }),
});

const createCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().max(100).required(),
    parentId: Joi.string().hex().length(24),
    description: Joi.string().trim().max(255).required(),
  }),
});

const categoryListing = Joi.object({
  query: Joi.object({
    limit: Joi.number().integer().positive(),
    skip: Joi.number().integer().positive(),
  }),
});

module.exports = {
  createCategorySchema,
  categoryIdSchema,
  categoryListing,
};
