const express = require('express');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

const { handleError } = require('../utils');

const app = express();

const User = require('../models/user');

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    User.findOne({ email }, (err, userDB) => {
        if (err) return handleError(res, 500, err);

        if (!userDB) return handleError(res, 401, { message: '(Email) or password are invalids' });

        if ( !bcrypt.compareSync( password, userDB.password  )) {
            return handleError(res, 400, { message: 'Email or (password) are invalids' });
        }

        const token = createToken(userDB);

        res.json({
            ok: true,
            token,
            data: userDB
        })
    })

})

app.post('/signup', (req, res) => {

    const body = req.body;

    if (!body.password) return handleError(res, 400, { message: 'Password is required' });



})

const createToken = (userDB) => {
    return jwt.sign({
        user: userDB
    }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN });
}

module.exports = app;