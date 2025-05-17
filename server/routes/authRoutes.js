/* const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

// The route /login uses the following middleware functions:
// 1) the usersController.login function to retrieve the user from the database

router.post("/login", usersController.login);

module.exports = router; */


// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

module.exports = router;
