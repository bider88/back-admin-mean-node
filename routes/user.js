const express = require('express');

const bcrypt = require('bcrypt');

const router = express.Router();

const { handleError, pagination } = require('../utils');
const mongoose = require('mongoose');

const User = require('../models/user');
const { verifyToken } = require('../middlewares/auth');

router.post('/', (req, res) => {

    const body = req.body;

    if (!body.password) {
        return handleError(res, 400, { message: 'Password is required' });
    }

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    user.save((err, userDB) => {
        if (err) return handleError(res, 400, err);

        res.status(201).json({
            ok: true,
            data: userDB
        })
    })
})

router.all('/*', verifyToken);

router.get('/', (req, res) => {

    const pag = pagination( req.query.page, req.query.limit )

    const { skip, limit, page } = pag

    User.find({})
    .skip(skip)
    .limit(limit)
    .exec((err, userDB) => {
        if (err) return handleError(res, 500, err);

        User.count({}, (err, total) => {
            if (err) return handleError(res, 500, err);

            res.status(200).json({
                ok: true,
                pagination: {
                    skip,
                    limit,
                    page,
                    total
                },
                data: userDB
            });
        })
    })
})

router.get('/:id', (req, res) => {

    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
        User.findById( id, (err, userDB) => {
            if (err) return handleError(res, 500, err);

            res.status(200).json({
                ok: true,
                data: userDB || []
            });
        })
    } else {
        handleError(res, 400, { message: 'ID is not valid'});
    }
})

router.put('/:id', (req,res) => {

    const { id } = req.params;

    const body = req.body;

    if (mongoose.Types.ObjectId.isValid(id)) {
        User.findById(id, (err, userDB) => {
            if(err) return handleError(res, 500, err);

            if (!userDB) return handleError(res, 400, { message: `User with id '${id}' not found` });

            userDB.name = body.name;
            userDB.email = body.email;
            userDB.role = body.role;

            userDB.save((err, userSaved) => {
                if(err) return handleError(res, 400, err);

                res.status(200).json({
                    ok: true,
                    data: userSaved
                })
            })
        })
    } else {
        handleError(res, 400, { message: 'ID is not valid'});
    }
})

router.delete('/:id', (req, res) => {

    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
        User.findByIdAndRemove(id, (err, userDB) => {
            if (err) return handleError(res, 500, err);

            if (!userDB) return handleError(res, 400, { message: `User with id '${id}' not found` });

            res.json({
                ok: true,
                data: userDB
            })
        })
    } else {
        handleError(res, 400, { message: 'ID is not valid'});
    }
})

module.exports = router;
