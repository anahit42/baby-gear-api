// eslint-disable-next-line no-unused-vars
const { CategoryModel } = require('../models');

async function getCategories(req, res, next) {
  try {
    const { limit, skip } = req.query;

    const [ categories, total ] = await Promise.all([
      CategoryModel.find().limit(parseInt(limit)).skip(parseInt(skip)),
      CategoryModel.countDocuments()
    ]);

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
