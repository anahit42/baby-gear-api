const { ProductModel } = require('../models');
const ValidationError = require('../errors/validation-error');

async function getProducts (req,res,next) {
  const { limit, skip } = req.query;
  try {
    if(isNaN(limit) | isNaN(skip) | limit < 0 | skip < 0 | limit % 1 != 0 | skip % 1 != 0) {
      return next(new ValidationError('Invalid parameter'));
    }
    const results = {};
    results.total = await ProductModel.countDocuments();
    results.data = await ProductModel.find().limit(parseInt(limit)).skip(parseInt(skip));

    return res.status(200).json({
      results
    });
  } catch (error) {
    return next(error);
  }

}

module.exports = {
  getProducts
};
