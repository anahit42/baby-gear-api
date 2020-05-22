const HttpStatus = require('http-status-codes');
const { CategoryModel } = require('../models');
const { ConflictError, NotFoundError } = require('../errors');

function getSlug(name) {
  return name.replace(/\s+/g, '-').toLowerCase();
}

async function createCategory(req, res, next) {
  try {
    const { name, parentId, description } = req.body;
    const slug = getSlug(name);
    const categoryExists = await CategoryModel.exists({ slug });

    if (categoryExists) {
      throw new ConflictError('Category with this name already exists.');
    }

    const createData = {
      name,
      slug,
      description,
      parentId,
      ancestors: [parentId],
    };

    if (parentId) {
      const parent = await CategoryModel.findById(parentId);

      if (!parent) {
        throw new NotFoundError(`The parent with id = ${parentId} not found`);
      }

      createData.ancestors = [...parent.ancestors, parentId];
    }

    const category = await CategoryModel.create(createData);

    return res.status(HttpStatus.OK).json({ data: category });
  } catch (error) {
    return next(error);
  }
}

async function getCategories(req, res, next) {
  try {
    const { limit, skip } = req.query;

    const [categories, total] = await Promise.all([
      CategoryModel.find().limit(limit).skip(skip).populate('ancestors'),
      CategoryModel.countDocuments(),
    ]);

    return res.status(200).json({
      result: categories,
      total,
    });
  } catch (error) {
    return next(error);
  }
}

async function getCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const category = await CategoryModel.findOne({ _id: categoryId }).populate('ancestors');

    if (!category) {
      throw new NotFoundError('Category not found.');
    }

    return res.status(HttpStatus.OK).json({
      data: category,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCategory,
  createCategory,
  getCategories,
};
