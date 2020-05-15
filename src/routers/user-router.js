const express = require('express');
const router = express.Router();

const {getUser} = require('../controllers/user-controller');
const {getUsers} = require('../controllers/user-controller');

router.get('/:userId', getUser);
router.get('/', getUsers);

module.exports = router;
