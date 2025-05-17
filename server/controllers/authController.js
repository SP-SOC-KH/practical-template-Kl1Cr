/* const { EMPTY_RESULT_ERROR, UNIQUE_VIOLATION_ERROR, DUPLICATE_TABLE_ERROR } = require('../errors');
const modulesModel = require('../../models/modules');

module.exports.create = function (req, res) {
    const code = req.body.code;
    const name = req.body.name;
    const credit = req.body.credit;

    return modulesModel
        .create(code, name, credit)
        .then(function () {
            return res.sendStatus(201);
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof UNIQUE_VIOLATION_ERROR) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        });
}

module.exports.retrieveByCode = function (req, res) {
    const code = req.params.code;

    return modulesModel
        .retrieveByCode(code)
        .then(function (module) {
            return res.json({ module: module });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        });
}

module.exports.deleteByCode = function (req, res) {
    // Delete module by Code
    const code = req.params.code;
    return modulesModel
        .deleteByCode(code)
        .then(function () {
            console.log("delete ok!");
            return res.status(200).json({ msg: "deleted!" });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                // return res.status(404).json({ error: error.message });
                return res.status(404).json({ error: "No such module!" });
            }
            return res.status(500).json({ error: error.message });
        });
}

module.exports.deleteByCode = function (req, res) {
    // Delete module by Code
    const code = req.params.code;
    return modulesModel
        .deleteByCode(code)
        .then(function () {
            console.log("delete ok!");
            return res.status(200).json({ msg: "deleted!" });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                // return res.status(404).json({ error: error.message });
                return res.status(404).json({ error: "No such module!" });
            }
            return res.status(500).json({ error: error.message });
        });
}


module.exports.updateByCode = function (req, res) {
    // You can decide where you want to put the Credit in the Request
    // Implement Update module by Code and the credit is in req.body
    const code = req.params.code;
    const credit = req.body.credit;
    return modulesModel
        .updateByCode(code, credit)
        .then(function () {
            console.log("update ok!");
            return res.status(200).json({ msg: "updated!" });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        });
}

module.exports.retrieveAll = function (req, res) {
    // get all modules
    return modulesModel
        .retrieveAll()
        .then(function (modules) {
            return res.json({ modules: modules });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
}

module.exports.initTable =  function (req, res) {
    return modulesModel
        .initTable()
        .then(function () {
            return res.status(200).json({ msg: "created!" });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof DUPLICATE_TABLE_ERROR) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        });
} */



        const bcrypt = require('bcrypt');
        const jwt = require('jsonwebtoken');
        const userModel = require('../models/authModel');
        
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
        
        module.exports.login = function (req, res) {
            const { email, password } = req.body;
        
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }
        
            return userModel.getUserByEmail(email)
                .then(function (user) {
                    if (!user) {
                        return res.status(401).json({ error: 'Invalid email or password.' });
                    }
        
                    if (!user.Is_Active) {
                        return res.status(403).json({ error: 'Please verify your email before logging in.' });
                    }
        
                    return bcrypt.compare(password, user.Password)
                        .then(function (match) {
                            if (!match) {
                                return res.status(401).json({ error: 'Invalid email or password.' });
                            }
        
                            // Generate JWT
                            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
        
                            return res.json({ message: 'Login successful.', token });
                        });
                })
                .catch(function (error) {
                    console.error('Login error:', error);
                    return res.status(500).json({ error: 'Internal server error.' });
                });
        };
        
