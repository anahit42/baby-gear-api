const mongoose = require('mongoose');

const ValidationError = require('../../errors/validation-error');

function validateProductId (req, res, next){
  const { productId } = req.params;

  if(!mongoose.Types.ObjectId.isValid(productId))
    return next(new ValidationError('Invalid product Id'));

  return next();
}

function validatePaging (req, res, next){
  const { limit, skip } = req.query;

  const convertedLimit = limit * 1;
  const convertedSkip = skip * 1;

  if(typeof convertedLimit != 'number' || (isNaN(convertedLimit) && limit !== undefined))
    return next(new ValidationError('Invalid paramenetrs'));
  else
    req.query.limit = !limit ? limit : convertedLimit;


  if(typeof convertedSkip != 'number' || (isNaN(convertedSkip) && skip !== undefined))
    return next(new ValidationError('Invalid paramenetrs'));
  else
    req.query.skip = !skip ? skip : convertedSkip;

  return next();
}

module.exports = {
  validatePaging,
  validateProductId
};
