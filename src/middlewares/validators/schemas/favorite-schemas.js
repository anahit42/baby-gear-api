const Joi = require('@hapi/joi');

const addFavoriteProductSchemas = Joi.object({
  body: Joi.object({
    productId: Joi.string().hex().length(24).required()
  })
});


module.exports = {
  addFavoriteProductSchemas
};
