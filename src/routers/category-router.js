const express = require('express');
const router = express.Router();

const { validateGetCategories } = require('../middlewares/validators/category-validator');
const { getCategories } = require('../controllers/category-controller');

router.get('/', validateGetCategories, getCategories);

module.exports = router;
