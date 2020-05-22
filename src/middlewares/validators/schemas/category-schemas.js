const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const { string } = Joi.types();

const categoryIdSchema = Joi.object({
  params: Joi.object({
    categoryId: string.hex().length(24).required()
  })
});

const createCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().max(100).required(),
    parentId: Joi.objectId(),
    description: Joi.string().trim().max(255).required()
   // ancestors: Joi.array().items(Joi.objectId())
  })
});


module.exports = {
  createCategorySchema,
  categoryIdSchema
};

