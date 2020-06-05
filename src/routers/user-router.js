const express = require('express');

const router = express.Router();

const { uploadImage } = require('../libs/multer-lib');
const { getUser, getUsers, uploadProfilePic, updateUser } = require('../controllers/user-controller');
const { getUserProducts } = require('../controllers/product-controller');
const { validateUserId, validateUpdateUser, validateLimitSkip } = require('../middlewares/validators/user-validator');
const { addProductToBucket } = require('../controllers/bucket-controller');
const { validateAddProductToBucket } = require('../middlewares/validators/bucket-validator');

router.get('/', validateLimitSkip, getUsers);
router.get('/:userId', validateUserId, getUser);
router.get('/:userId/products', validateUserId, validateLimitSkip, getUserProducts);
router.patch('/:userId', validateUpdateUser, updateUser);
router.post('/:userId/image', validateUserId, uploadImage.single('image'), uploadProfilePic);

const {
  getBucket,
  removeBucket,
} = require('../controllers/bucket-controller');

router.get('/:userId/bucket', validateUserId, getBucket);
router.delete('/:userId/bucket', validateUserId, removeBucket);
router.post('/:userId/bucket/product', validateAddProductToBucket, addProductToBucket);


module.exports = router;
