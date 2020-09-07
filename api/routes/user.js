const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', userController.signUp);

router.post('/login', userController.logIn);

router.delete('/:userId', checkAuth, userController.delete_user);

module.exports = router;