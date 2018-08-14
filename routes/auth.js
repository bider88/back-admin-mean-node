const express = require('express');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    })

    user.save((err, userDB) => {
        if (err) return handleError(res, 500, err);

        const token = createToken(userDB)

        res.json({
            ok: true,
            token,
            data: userDB
        })
    })



})

app.post('/google', async (req, res) => {

    const token = req.body.token;

    let userGoogle;

    try {
        userGoogle = await verify( token );
    } catch(err) {
        return handleError(res, 403, { message: 'Google token is not valid' });
    }

    User.findOne({ email: userGoogle.email}, (err, userDB) => {
        if (err) {
            return handleError(res, 500, err);
        }

        if (userDB) {
            if (!userDB.google) {
                if (err) {
                    return handleError(res, 400, { message: 'Debe usar autenticación normal'});
                }
            } else {
                const token = createToken(userDB);

                return res.json({
                    ok: true,
                    token,
                    data: userDB
                })
            }
        } else {
            // si el usuario n existe en la bd, se guarda con los datos de google
            const user = new User();

            user.name = userGoogle.name;
            user.email = userGoogle.email;
            user.img = userGoogle.img;
            user.google = true;
            user.password = bcrypt.hashSync(':) supersecret', 10);

            user.save( (err, userDB) => {
                if (err) {
                    return handleError(res, 500, err);
                }

                const token = createToken(userDB);

                return res.json({
                    ok: true,
                    token,
                    data: userDB
                })
            })
        }
    })
})

// Google configurations
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

const createToken = (userDB) => {
    return jwt.sign({
        user: userDB
    }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN });
}

module.exports = app;
