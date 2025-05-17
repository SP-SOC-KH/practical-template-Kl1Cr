const express = require('express');
const emailVerificationController = require('../controllers/emailVerificationController');
const router = express.Router();

router.get('/verify', emailVerificationController.verifyEmail);

module.exports = router;