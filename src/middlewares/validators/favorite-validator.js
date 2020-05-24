const { FavoriteSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateGetFavorite(req, res, next) {
  return ValidationHandlerUtil.validate(FavoriteSchemas.favoriteGetSingle, req, next);
}

function validateListFavorites(req, res, next) {
  return ValidationHandlerUtil.validate(FavoriteSchemas.favoriteList, req, next);
}

function validateAddFavoriteProduct(req, res, next) {
  return ValidationHandlerUtil.validate(FavoriteSchemas.addFavoriteProductSchemas, req, next);
}

module.exports = {
  validateAddFavoriteProduct,
  validateGetFavorite,
  validateListFavorites,
};
