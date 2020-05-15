const express = require('express');
const router = express.Router();

const { validateProductId } = require('../middlewares/validators/product-validator');
const { uploadImage } = require('../libs/multer-lib');
const { uploadImages } = require('../controllers/product-controller');

router.post('/:productId/images', validateProductId, uploadImage.array('productImage', 12), uploadImages);

module.exports = router;
