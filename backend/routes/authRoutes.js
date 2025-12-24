const express = require('express');
const { register, login, googleLogin } = require('../controllers/authController');
const router = express.Router();

// router.post('/register', register); // Disabled public registration
router.post('/login', login);
router.post('/google-login', googleLogin);

module.exports = router;
