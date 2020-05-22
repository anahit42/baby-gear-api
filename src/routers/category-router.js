const express = require('express');

const router = express.Router();

const { validateGetCategories, validateCreateCategory } = require('../middlewares/validators/category-validator');
const { getCategories, createCategory } = require('../controllers/category-controller');

router.get('/', validateGetCategories, getCategories);
router.post('/', validateCreateCategory, createCategory);

module.exports = router;
