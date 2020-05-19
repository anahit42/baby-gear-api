const ValidationError = require('../../errors/validation-error');
const mongoose = require('mongoose');

function validateOrderId (req, res, next){
  const { orderId } = req.params;

  if(!mongoose.Types.ObjectId.isValid(orderId))
    return next(new ValidationError('Invalid order Id'));
  
  return next();
}

module.exports = {
  validateOrderId
};