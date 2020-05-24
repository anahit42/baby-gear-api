const express = require('express');

const router = express.Router();
const AuthMiddleware = require('../middlewares/auth-middleware');

const { uploadImage } = require('../libs/multer-lib');

const {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
} = require('../middlewares/validators/product-validator');

const {
  getProduct,
  getProducts,
  updateProduct,
  createProduct,
  uploadImages,
  deleteProduct,
} = require('../controllers/product-controller');

router.get('/', getProducts);
router.get('/:productId', validateProductId, getProduct);

router.use(AuthMiddleware.authorize);
router.post('/', validateCreateProduct, createProduct);
router.patch('/:productId', validateUpdateProduct, updateProduct);
router.delete('/:productId', deleteProduct);
router.post(
  '/:productId/images',
  validateProductId,
  uploadImage.array('productImage', 12),
  uploadImages
);

module.exports = router;
