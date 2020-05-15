// eslint-disable-next-line no-unused-vars
const { FavoritesModel } = require('../models');
async function getFavorites(req, res, next){
  const { limit, offset } = req.params;
  try{
    return res.status(200).json({
      orders: await FavoritesModel.find().limit(limit).skip(offset).exec()
    }); 
  }
  catch(error){
    next(error);
  }
}

module.exports = {
  getFavorites
};
