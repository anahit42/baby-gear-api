const { FavoritesModel } = require('../models');
const NotfoundError = require('../errors/not-found-error');

async function deleteFavorite(req, res, next){
  const { productId }  = req.params;
  const userId = res.userData._id;

  try {

    const favoriteData = await FavoritesModel.findOneAndUpdate({ userId, products: productId },  {
      $pull: {
        products: productId
      }
    }, { new: true });

    if(!favoriteData) {
      throw new NotfoundError('Item not found');
    }

    return res.status(200).json({ results: favoriteData });
  } catch (error) {
    return next(error);
  }

}

async function getFavorites(req, res, next){
  const { limit, skip } = req.query;
  const userId = req.userData._id;

  try {
    const favorites = await FavoritesModel.findOne({ userId })
      .limit(limit)
      .skip(skip);

    return res.status(200).json({ results: favorites });
  } catch(error){
    return next(error);
  }
}

module.exports = {
  getFavorites,
  deleteFavorite
};
