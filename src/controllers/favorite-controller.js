const { FavoritesModel } = require('../models');
const NotfoundError = require('../errors/not-found-error');

async function deleteFavorite(req, res, next){
  const { productId }  = req.params;
  const userId = res.userData._id;
  try {

    const product = await FavoritesModel.findOne({
      userId
    }, (err, doc)=>{
      if(err)
        return next(err);

      let found = false;
      for(let i in doc.products){
        let id = doc.products[i]; 
        if(id == productId){
          found = true;
          doc.products.splice(i, 1);
          break;
        }
      }

      if(!found)
        return next(new NotfoundError('Item not found'));
        
      doc.save();
    });
      
    if(!product)
      return next(new NotfoundError('Item not found'));
        
    return res.status(200).json(product);

  }
  catch (error) {
    return next(error);
  }

}

module.exports = {
  deleteFavorite
};
