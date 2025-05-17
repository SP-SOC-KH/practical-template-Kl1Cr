const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const emailVerificationRoutes = require('./routes/emailVerificationRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email-verification', emailVerificationRoutes);

module.exports = app;