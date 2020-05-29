const express = require('express');

const router = express.Router();

const { uploadImage } = require('../libs/multer-lib');
const AuthMiddleware = require('../middlewares/auth-middleware');

const {
  createCategory,
  getCategory,
  getCategories,
  uploadCategoryImage } = require('../controllers/category-controller');
const {
  validateCategoryId,
  validateCreateCategory,
  validateGetCategories,
} = require('../middlewares/validators/category-validator');

router.get('/', validateGetCategories, getCategories);
router.get('/:categoryId', validateCategoryId, getCategory);

router.use(AuthMiddleware.authorize);
router.post('/', validateCreateCategory, createCategory);
router.post('/:categoryId/image', validateCategoryId, uploadImage.single('image'), uploadCategoryImage);

module.exports = router;
