const express = require('express');
const router = express.Router();

const { handleError, pagination } = require('../utils');

const mongoose = require('mongoose');

const Doctor = require('../models/doctor');
const { verifyToken } = require('../middlewares/auth');

router.get('/', (req, res) => {

    const pag = pagination( req.query.page, req.query.limit )

    const { skip, limit, page } = pag

    Doctor.find({})
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate({
        path: 'hospital',
        populate: {
            path: 'user',
            model: 'User',
            options: { select: '_id name' }
        }
    })
    .exec((err, doctorsDB) => {
        if (err) return handleError(res, 500, err);

        Doctor.count({}, (err, total) => {
            if (err) return handleError(res, 500, err);
            
            res.json({
                ok: true,
                pagination: {
                    skip,
                    limit,
                    page,
                    total
                },
                data: doctorsDB
            })
        })
    })
})

router.get('/:id', (req, res) => {

    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
        Doctor.findById( id)
        .populate('hospital')
        .exec((err, doctorDB) => {
            if (err) return handleError(res, 500, err);
    
            res.status(200).json({
                ok: true,
                data: doctorDB || []
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

    const doctor = new Doctor({
        name: body.name,
        user: id,
        hospital: body.hospital
    })

    doctor.save((err, doctorDB) => {
        if (err) return handleError(res, 500, err);

        res.json({
            ok: true,
            data: doctorDB
        })
    })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;

    const body = req.body;

    if (mongoose.Types.ObjectId.isValid(id)) {
        Doctor.findById(id, (err, doctorDB) => {
            if(err) return handleError(res, 500, err);

            if (!doctorDB) return handleError(res, 400, { message: `Doctor with id '${id}' not found` });

            doctorDB.name = body.name;
            doctorDB.user = req.user._id;
            doctorDB.hospital = body.hospital;

            doctorDB.save((err, doctorSaved) => {
                if(err) return handleError(res, 400, err);

                res.status(200).json({
                    ok: true,
                    data: doctorSaved
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
        
        Doctor.findByIdAndRemove( id )
        .exec((err, doctorDB) => {
            if (err) return handleError(res, 500, err);

            if (!doctorDB) return handleError(res, 400, { message: `Doctor with id '${id}' not found` });

            res.json({
                ok: true,
                data: doctorDB
            })
        })

    } else {
        handleError(res, 400, { message: 'ID is not valid'});
    }
})

module.exports = router;