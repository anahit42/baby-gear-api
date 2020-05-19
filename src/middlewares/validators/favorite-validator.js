const ValidationError = require('../../errors/validation-error');
const mongoose = require('mongoose');

function validateProductId (req, res, next){
  const { productId } = req.params;

  if(!mongoose.Types.ObjectId.isValid(productId))
    return next(new ValidationError('Invalid product Id'));
  
  return next();
}


module.exports = {
  validateProductId
};
