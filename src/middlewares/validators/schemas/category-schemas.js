const Joi = require('@hapi/joi');

const categoryListing = Joi.object({
  query: Joi.object({
    limit: Joi.number().integer().positive(),
    skip: Joi.number().integer().positive(),
  }),
});

module.exports = {
  categoryListing,
};
