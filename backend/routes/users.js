const express = require('express');
const router = express.Router();

const User = require('../models/userModel');
const {
    userSignup,
    userLogin
} = require('../controllers/userController');

// signup route
router.post('/signup', userSignup)

// login route
router.post('/login', userLogin)

module.exports = router;