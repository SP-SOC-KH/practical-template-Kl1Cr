const { UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION } = require('../errors');
const emailVerificationModel = require('../models/emailVerificationModel');

/* module.exports.verifyEmail = function (req, res) {
    console.log('Received verification request with token:', req.query.token);
    const token = req.query.token;
    console.log(token);

    return emailVerificationModel.verifyEmail(token)
        .then(function (result) {
            if (result) {
                return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
            }
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof UNIQUE_VIOLATION_ERROR || error instanceof RAISE_EXCEPTION) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        });
}; */

module.exports.verifyEmail = function (req, res) {
    const token = req.query.token;

    return emailVerificationModel.verifyEmail(token)
        .then(function (result) {
            if (result) {
                return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
            }
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof UNIQUE_VIOLATION_ERROR || error instanceof RAISE_EXCEPTION) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        });
};
