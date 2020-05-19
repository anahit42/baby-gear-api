const express = require('express');
const router = express.Router();

const { validateRegisterUser, validateLoginUser } = require('../middlewares/validators/user-validator');

const { login, register, registerAdmin } = require('../controllers/auth-controller');

router.post('/login', validateLoginUser, login);
router.post('/register', validateRegisterUser, register);
router.post('/register/admin', validateRegisterUser, registerAdmin);

module.exports = router;
