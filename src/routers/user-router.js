const express = require('express');
const router = express.Router();

const upload = require('../libs/multer-lib');

const { getUser, uploadProfilePic } = require('../controllers/user-controller');

router.get('/:userId', getUser);

router.post('/:userId/image', upload.single('image'), uploadProfilePic);

module.exports = router;
