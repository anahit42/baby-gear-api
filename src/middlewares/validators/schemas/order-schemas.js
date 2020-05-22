const Joi = require('@hapi/joi');

const { string, number } = Joi.types();

const orderGetSingle = Joi.object({
  params: Joi.object({
    productId: string.hex().length(24).required(),
  }),
});

const orderList = Joi.object({
  query: Joi.object({
    limit: number.integer().positive(),
    skip: number.integer().positive(),
  }),
});

module.exports = {
  orderGetSingle,
  orderList,
};
