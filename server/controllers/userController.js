const { UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION } = require('../errors');
const userModel = require('../models/userModels');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports.retrieveAll = function (req, res) {
    return userModel
        .retrieveAll()
        .then(function (allUsers) {
            return res.json({ users: allUsers });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: "Unknown Error" });
        });
};

module.exports.createUser = function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const phone = req.body.phone || null;
    const joinDate = req.body.joinDate || new Date().toISOString();
    const departmentId = req.body.departmentId || 1; // Automatically sets default to Human Resources
    const roleId = req.body.roleId || 1; // Automatically sets default to Employee
    const salary = req.body.salary || 0.00;

    // Basic input validation
    if (!firstName || !lastName || !email || !password || !username) {
        return res.status(400).json({ error: "Missing required fields: firstName, lastName, email, password, and username are required" });
    }
     
    // Password validation
    if (password.length < 8) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long"
        });
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        return res.status(400).json({
            error: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        });
    }

    //Phone number validation
    if (phone && (!/^\d{8}$/.test(phone))) {
        return res.status(400).json({
            error: "Phone number must be exactly 8 digits"
        });
    }

    return bcrypt.hash(password, 10)
        .then(function (hashedPassword) {
            const verificationToken = crypto.randomBytes(32).toString('hex');
            console.log(`Assigning user to Department_ID: ${departmentId} (Human Resources) and Role_ID: ${roleId} (Employee)`);
            return userModel.createUser(firstName, lastName, email, hashedPassword, username, phone, joinDate, departmentId, roleId, salary, verificationToken)
                .then(function (userId) {
                    console.log(`Verification email sent to ${email} with token ${verificationToken}`);
                    return res.status(201).json({ 
                        message: 'User created. Please verify your email.', 
                        userId, 
                        departmentId, 
                        roleId 
                    });
                });
        })
        .catch(function (error) {
            console.log(error);
            if (error instanceof UNIQUE_VIOLATION_ERROR) {
                return res.status(400).json({ error: error.message });
            }
            if (error instanceof RAISE_EXCEPTION) {
                return res.status(400).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).send('Unknown error');
        });
};

