const express = require('express');
const router = express.Router();

const { uploadImage } = require('../libs/multer-lib');

const {
  validateProductId, validateCreateProduct, validateUpdateProduct
} = require('../middlewares/validators/product-validator');

const { validateUserId } = require('../middlewares/validators/user-validator');
const { validateSkipLimit } = require('../middlewares/validators/handlers');

const {
  getProduct, getProducts, getUserProducts, updateProduct, createProduct, uploadImages
} = require('../controllers/product-controller');

router.get('/', getProducts);
router.post('/', validateCreateProduct, createProduct);
router.get('/:userId', validateUserId, validateSkipLimit, getUserProducts);
router.get('/:productId', validateProductId, getProduct);
router.patch('/:productId', validateUpdateProduct, updateProduct);
router.post('/:productId/images', validateProductId, uploadImage.array('productImage', 12), uploadImages);

module.exports = router;
