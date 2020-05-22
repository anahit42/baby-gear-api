const express = require('express');

const router = express.Router();

const { uploadImage } = require('../libs/multer-lib');
const { getUser, getUsers, uploadProfilePic, updateUser } = require('../controllers/user-controller');
const { getUserProducts } = require('../controllers/product-controller');
const { validateUserId, validateUpdateUser, validateLimitSkip } = require('../middlewares/validators/user-validator');
const { validateSkipLimit } = require('../middlewares/validators/handlers');

router.get('/', validateLimitSkip, getUsers);
router.get('/:userId', validateUserId, getUser);
router.get('/:userId/products', validateUserId, validateSkipLimit, getUserProducts);
router.patch('/:userId', validateUpdateUser, updateUser);
router.post('/:userId/image', validateUserId, uploadImage.single('image'), uploadProfilePic);

module.exports = router;
