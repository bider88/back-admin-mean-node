const express = require('express');
const router = express.Router();

const { handleError, pagination } = require('../utils');

const mongoose = require('mongoose');

const Hospital = require('../models/hospital');
const { verifyToken } = require('../middlewares/auth');

router.get('/', (req, res) => {

    const pag = pagination( req.query.from, req.query.limit )

    Hospital.find({})
    .skip(pag.from)
    .limit(pag.limit)
    .exec((err, hospitalsDB) => {
        if (err) return handleError(res, 500, err);

        res.json({
            ok: true,
            data: hospitalsDB || []
        })
    })
})

router.get('/:id', (req, res) => {

    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
        Hospital.findById( id, (err, hospitalDB) => {
            if (err) return handleError(res, 500, err);
    
            res.status(200).json({
                ok: true,
                data: hospitalDB || []
            });
        })
    } else {
        handleError(res, 400, { message: 'ID is not valid'});
    }
})

router.all('/*', verifyToken);

router.post('/', (req, res) => {
    
    const body = req.body;
    const id = req.user._id;

    const hospital = new Hospital({
        name: body.name,
        user: id
    })

    hospital.save((err, hospitalDB) => {
        if (err) return handleError(res, 500, err);

        res.json({
            ok: true,
            data: hospitalDB
        })
    })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;

    const body = req.body;

    console.log(body);

    if (mongoose.Types.ObjectId.isValid(id)) {
        
        Hospital.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, hospitalDB) => {
            if (err) return handleError(res, 500, err);
            if (!hospitalDB) return handleError(res, 400, { message: 'Hospital not found'});

            res.json({
                ok: true,
                data: hospitalDB
            })
        })

    } else {
        handleError(res, 400, { message: 'ID is not valid'});
    }
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
        
        Hospital.findByIdAndRemove( id )
        .exec((err, hospitalDB) => {
            if (err) return handleError(res, 500, err);

            if (!hospitalDB) return handleError(res, 400, { message: `Hospital with id '${id}' not found` });

            res.json({
                ok: true,
                data: hospitalDB
            })
        })

    } else {
        handleError(res, 400, { message: 'ID is not valid'});
    }
})

module.exports = router;