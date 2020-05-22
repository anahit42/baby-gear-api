const express = require('express');
const router = express.Router();

const { uploadImage } = require('../libs/multer-lib');
const { getUser, getUsers, uploadProfilePic, updateUser } = require('../controllers/user-controller');
const { validateUserId, validateUpdateUser, validateLimitSkip } = require('../middlewares/validators/user-validator');

router.get('/', validateLimitSkip, getUsers);
router.get('/:userId', validateUserId, getUser);
router.patch('/:userId', validateUpdateUser, updateUser);
router.post('/:userId/image', validateUserId, uploadImage.single('image'), uploadProfilePic);

module.exports = router;
