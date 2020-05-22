const express = require('express');
const router = express.Router();

const { validateCategoryId, validateCreateCategory } = require('../middlewares/validators/category-validator');

const { createCategory, getCategory } = require('../controllers/category-controller');

router.get('/:categoryId', validateCategoryId, getCategory);
router.post('/', validateCreateCategory, createCategory);

module.exports = router;


