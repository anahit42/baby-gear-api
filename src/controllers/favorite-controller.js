const { FavoritesModel } = require('../models');

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
  getFavorites
};
