const express = require('express');
const { register, login, verifyEmail } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middlewares/validators/authValidator');
const handleValidation = require('../middlewares/validators/handleValidation');

const router = express.Router();

router.post('/register', registerValidation, handleValidation, register);
router.post('/login', loginValidation, handleValidation, login);
router.get('/verify/:token', verifyEmail);

module.exports = router;
