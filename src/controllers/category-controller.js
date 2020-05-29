const { CategoryModel } = require('../models');
const { ConflictError, NotFoundError, ValidationError } = require('../errors');
const { ResponseHandlerUtil } = require('../utils');
const { uploadAndUpdateModelItem } = require('../libs/upload-lib');
const FileManagerLib = require('../libs/file-manager-lib');

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
        throw new NotFoundError(`The parent with id = ${parentId} not found.`);
      }

      createData.ancestors = [...parent.ancestors, parentId];
    }

    const category = await CategoryModel.create(createData);

    return ResponseHandlerUtil.handleCreate(res, category);
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

    return ResponseHandlerUtil.handleList(res, categories, total);
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

    return ResponseHandlerUtil.handleGet(res, category);
  } catch (error) {
    return next(error);
  }
}

async function uploadCategoryImage(req, res, next) {
  try {
    const { file } = req;
    const { categoryId } = req.params;

    const categoryExists = await CategoryModel.exists({ _id: categoryId });
    if (!categoryExists) {
      throw new NotFoundError(`Category with id = ${categoryId} not found.`);
    }

    const fileType = await FileManagerLib.getFileType(file);

    if (!fileType.mime) {
      throw new ValidationError('Only images allowed');
    }

    const _id = categoryId;
    const updateField = 'image';
    const url = await uploadAndUpdateModelItem({ file, fileType, _id, updateField }, CategoryModel);

    return ResponseHandlerUtil.handleUpdate(res, { url });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCategory,
  createCategory,
  getCategories,
  uploadCategoryImage,
};
