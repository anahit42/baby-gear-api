const express = require('express');

const router = express.Router();

const AuthMiddleware = require('../middlewares/auth-middleware');

const { createCategory, getCategory, getCategories } = require('../controllers/category-controller');
const {
  validateCategoryId,
  validateCreateCategory,
  validateGetCategories,
} = require('../middlewares/validators/category-validator');

router.get('/', validateGetCategories, getCategories);
router.get('/:categoryId', validateCategoryId, getCategory);

router.use(AuthMiddleware.authorize);
router.post('/', validateCreateCategory, createCategory);

module.exports = router;
