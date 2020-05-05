const express = require('express');
const router = express.Router();

const { validateRegisterUser } = require('../middlewares/validators/user-validator');

const { login, register } = require('../controllers/auth-controller');

router.post('/login', login);
router.post('/register', validateRegisterUser, register);

module.exports = router;
