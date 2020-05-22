// eslint-disable-next-line no-unused-vars
const { CategoryModel } = require('../models');
const { NotFoundError } = require('../errors');

async function getCategories(req, res, next) {
  try {
    const { limit, skip } = req.query;

    const [ categories, total ] = await Promise.all([
      CategoryModel.find().limit(parseInt(limit)).skip(parseInt(skip)),
      CategoryModel.countDocuments()
    ]);

    if (!categories) {
      throw new NotFoundError('Category not found');
    }

    return res.status(200).json({
      result: categories,
      total
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCategories
};
