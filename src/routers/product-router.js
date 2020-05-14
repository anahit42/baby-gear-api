const express = require('express');
const router = express.Router();

const { uploadImage } = require('../libs/multer-lib');
const { uploadImages } = require('../controllers/product-controller');

router.post('/:id/images', uploadImage.array('productImage', 12), uploadImages);

module.exports = router;
