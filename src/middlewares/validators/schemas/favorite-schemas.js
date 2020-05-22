const Joi = require('@hapi/joi');

const { string, number } = Joi.types();

const favoriteGetSingle = Joi.object({
  params: Joi.object({
    productId: string.hex().length(24).required(),
  }),
});

const favoriteList = Joi.object({
  query: Joi.object({
    limit: number.integer().positive(),
    skip: number.integer().positive(),
  }),
});

module.exports = {
  favoriteGetSingle,
  favoriteList,
};
