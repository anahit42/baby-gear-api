const express = require('express');
const router = express.Router();

const { getUser, getUsers, uplaodImage } = require('../controllers/user-controller');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/:userId/image', uplaodImage);


module.exports = router;
