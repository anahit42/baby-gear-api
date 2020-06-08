const express = require('express');

const router = express.Router();

const { uploadImage } = require('../libs/multer-lib');
const { getUser, getUsers, uploadProfilePic, updateUser } = require('../controllers/user-controller');
const { getUserProducts } = require('../controllers/product-controller');
const { addProductToBucket, getBucket, updateBucket } = require('../controllers/bucket-controller');
const { validateUserId, validateUpdateUser, validateLimitSkip } = require('../middlewares/validators/user-validator');
const { validateAddProductToBucket, validateUpdateBucket } = require('../middlewares/validators/bucket-validator');

router.get('/', validateLimitSkip, getUsers);
router.get('/:userId', validateUserId, getUser);
router.patch('/:userId', validateUpdateUser, updateUser);

router.get('/:userId/products', validateUserId, validateLimitSkip, getUserProducts);
router.post('/:userId/image', validateUserId, uploadImage.single('image'), uploadProfilePic);

router.get('/:userId/bucket', validateUserId, getBucket);
router.patch('/:userId/bucket', validateUpdateBucket, updateBucket);
router.post('/:userId/bucket/product', validateAddProductToBucket, addProductToBucket);

module.exports = router;
