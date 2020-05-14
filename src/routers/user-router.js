const express = require('express');
const router = express.Router();

const { validateUpdateUser } = require('../middlewares/validators/user-validator');
const { getUser, updateUser } = require('../controllers/user-controller');

router.get('/:userId', getUser);

router.patch('/:userId', validateUpdateUser, updateUser);

module.exports = router;
