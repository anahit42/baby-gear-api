const { CategoryModel } = require('../models');

async function getCategories(req, res, next) {
  try {
    const { limit, skip } = req.query;

    const [categories, total] = await Promise.all([
      CategoryModel.find().limit(limit).skip(skip),
      CategoryModel.countDocuments(),
    ]);

    return res.status(200).json({
      data: categories,
      total,
    });
  } catch (error) {
    return next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, description, subCategories } = req.body;

    const category = await CategoryModel.create({ name, description, subCategories });

    return res.status(200).json({ data: category });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCategories,
  createCategory,
};
