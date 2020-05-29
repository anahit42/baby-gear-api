const { FavoritesModel } = require('../models');
const { NotFoundError } = require('../errors');

const { ResponseHandlerUtil } = require('../utils');

async function deleteFavorite(req, res, next) {
  const { productId } = req.params;
  const userId = req.userData._id;

  try {
    const favoriteData = await FavoritesModel.findOneAndUpdate({ userId, products: productId }, {
      $pull: {
        products: productId,
      },
    }, { new: true });

    if (!favoriteData) {
      throw new NotFoundError('Item not found');
    }

    return ResponseHandlerUtil.handleDelete(res);
  } catch (error) {
    return next(error);
  }
}

async function getFavorites(req, res, next) {
  const { limit, skip } = req.query;
  const userId = req.userData._id;

  try {
    const favorites = await FavoritesModel.findOne({ userId })
      .limit(limit)
      .skip(skip)
      .populate('products');

    return ResponseHandlerUtil.handleGet(res, favorites);
  } catch (error) {
    return next(error);
  }
}

async function addFavoriteProduct(req, res, next) {
  const { productId } = req.body;
  const userId = req.userData._id;
  try {
    const favoriteData = await FavoritesModel.findOneAndUpdate(
      { userId },
      { $addToSet: { products: productId } },
      { new: true }
    );

    if (!favoriteData) {
      throw new NotFoundError('Not found');
    }

    return ResponseHandlerUtil.handleCreate(res, favoriteData);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getFavorites,
  deleteFavorite,
  addFavoriteProduct,
};
