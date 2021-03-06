const Joi = require('@hapi/joi');
const config = require('config');

const status = config.get('validation.product.status');
const condition = config.get('validation.product.condition');

const { string, number, date } = Joi.types();

const productIdSchema = Joi.object({
  params: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
});

const productSearchSchema = Joi.object({
  query: Joi.object({
    q: Joi.string().required(),
  }),
});

const productsCreateSchema = Joi.object({
  body: Joi.object({
    name: string.trim().max(200).required(),
    description: string.trim().max(500).required(),
    price: string.trim().pattern(/^([0-9]*[.])?[0-9]+$/, 'numbers').required(),
    properties: Joi.object({
      color: string.trim().max(100).required(),
      size: string.trim().max(100).required(),
      weight: string.trim().max(100),
      ageFrom: number.integer().required(),
      ageTo: number.integer().required(),
    }).required(),
    customProperties: Joi.object(),
    condition: string.valid(...condition).trim().required(),
    status: string.valid(...status).trim(),
    quantity: number.integer().required(),
    brand: string.trim().max(100),
    country: string.trim().max(100),
    issueDate: date.greater('1-1-1974').prefs({ convert: true }),
    category: string.hex().length(24).required(),
  }),
});

const productsUpdateSchema = Joi.object({
  body: Joi.object({
    name: string.trim().max(200),
    description: string.trim().max(500),
    price: string.trim().pattern(/^([0-9]*[.])?[0-9]+$/, 'numbers'),
    properties: Joi.object({
      color: string.trim().max(100),
      size: string.trim().max(100),
      weight: string.trim().max(100),
      ageFrom: number.integer(),
      ageTo: number.integer(),
    }),
    customProperties: Joi.object(),
    condition: string.valid(...condition).trim(),
    status: string.valid(...status).trim(),
    quantity: number.integer(),
    brand: string.trim().max(100),
    country: string.trim().max(100),
    issueDate: date.greater('1-1-1974').prefs({ convert: true }),
    category: string.hex().length(24).required(),
  }),
  params: Joi.object({
    productId: string.hex().length(24).required(),
  }),
});

module.exports = {
  productIdSchema,
  productsCreateSchema,
  productsUpdateSchema,
  productSearchSchema,
};
