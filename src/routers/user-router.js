const express = require('express');
const router = express.Router();

const { uploadImage } = require('../libs/multer-lib');
const { getUser, getUsers, uploadProfilePic, updateUser } = require('../controllers/user-controller');
const { validateUserId, validateUpdateUser } = require('../middlewares/validators/user-validator');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/:userId', validateUpdateUser, updateUser);
router.post('/:userId/image', validateUserId, uploadImage.single('image'), uploadProfilePic);

module.exports = router;
