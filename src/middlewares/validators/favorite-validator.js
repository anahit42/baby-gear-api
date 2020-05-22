const config = require('config');
const { FavoriteSchemas } = require('./schemas');
const { handleErrorDetails } = require('./handlers');

const validationOptions = config.get('validation.options');

function validateGetFavorite(req, res, next) {
  const { error } = FavoriteSchemas.favoriteGetSingle.validate(req, validationOptions);
  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateListFavorites(req, res, next) {
  const { error } = FavoriteSchemas.favoriteList.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

module.exports = {
  validateGetFavorite,
  validateListFavorites,
};
