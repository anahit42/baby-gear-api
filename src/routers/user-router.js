const express = require('express');
const router = express.Router();

const { uploadImage } = require('../libs/multer-lib');

const { getUser, uploadProfilePic } = require('../controllers/user-controller');

const { validateUserId } = require('../middlewares/validators/user-validator');

router.get('/:userId', getUser);

router.post('/:userId/image', validateUserId, uploadImage.single('image'), uploadProfilePic);

module.exports = router;
