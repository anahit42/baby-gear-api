const Joi = require('@hapi/joi');

const { string, number } = Joi.types();

const addFavoriteProductSchemas = Joi.object({
  body: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
});

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
  addFavoriteProductSchemas,
  favoriteGetSingle,
  favoriteList,
};
