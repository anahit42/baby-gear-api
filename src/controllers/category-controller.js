// eslint-disable-next-line no-unused-vars
const { CategoryModel } = require('../models');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const HttpStatus = require('http-status-codes');

async function createCategory(req, res, next) {
  try {
    const { name, parentId, description } = req.body;
    const slug = getSlug(name);
    const categoryExists = await CategoryModel.exists({ slug });

    if (categoryExists) {
      throw new ConflictError('Category with this name already exists.');
    }

    let ancestors = [];
    let parentExists;
    if (parentId) {
      parentExists = await CategoryModel.exists({ _id: parentId });
      if (!parentExists) {
        throw new NotFoundError(`The parent with id = ${parentId} not found`);
      } else {
        ( { ancestors } = await CategoryModel.findById(parentId) || [] );

        ancestors.push(parentId);
      }
    }

    const category = await CategoryModel.create({
      name,
      slug,
      description,
      parentId,
      ancestors
    });

    return res.status(HttpStatus.OK).json({
      category
    });
  } catch (error) {
    return next(error);
  }
}

async function getCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const { _id, name, description, parentId, ancestors } = await CategoryModel.findOne({ '_id' : categoryId });

    if (!name) {
      throw new NotFoundError(`${CategoryModel.collection.collectionName} ${HttpStatus.NOT_FOUND}`);
    }

    const ancestorsObjects = await CategoryModel.find().where('_id').in(ancestors);
    return res.status(HttpStatus.OK).json({
      _id,
      name,
      description,
      parentId,
      ancestorsObjects
    });
  } catch (error) {
    return next(error);
  }
}

function getSlug(name) {
  return name.replace(/\s+/g, '-').toLowerCase();
}

module.exports = {
  getCategory,
  createCategory
};
