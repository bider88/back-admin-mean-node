const express = require('express')
const router = express.Router();

const { verifyToken } = require('../middlewares/auth')

const { handleError, pagination } = require('../utils')

const Hospital = require('../models/hospital')
const Doctor = require('../models/doctor')
const User = require('../models/user')

router.all('*', verifyToken)

router.get('/:key', (req, res) => {

    const pag = pagination( req.query.page, req.query.limit )

    const { skip, limit, page } = pag

    const { key } = req.params

    const regex = new RegExp(key, 'i');

    const query = key === 'all' ? { } : { $or: [ { name: regex}, {email: regex} ] };

    Promise.all( [ searchHospital( query, skip, limit ), searchDoctor( query, skip, limit  ), searchUser( query, skip, limit  ) ] )
                .then( results => {

                    res.json({
                       ok: true,
                        pagination: {
                            skip,
                            limit,
                            page
                        },
                        search: key,
                        hospitals: {
                            data: results[0].results,
                            total: results[0].total
                        },
                        doctors: {
                            data: results[1].results,
                            total: results[1].total
                        },
                        users: {
                            data: results[2].results,
                            total: results[2].total
                        } 
                    })
                    
                })
                .catch(err => handleError(res, 500, err))
})

router.get('/:collection/:key', (req, res) => {

    const pag = pagination( req.query.page, req.query.limit )

    const { skip, limit, page } = pag

    const { key } = req.params
    const { collection } = req.params

    const regex = new RegExp(key, 'i');

    const query = key === 'all' ? { } : { $or: [ { name: regex}, {email: regex} ] };


    let result;

    switch( collection ) {
        case 'hospital':
            result = searchHospital(query, skip, limit)
        break;
        case 'doctor':
            result = searchDoctor(query, skip, limit)
        break;
        case 'user':
            result = searchUser(query, skip, limit)
        break;
        default:
            return handleError(res, 400, {message: 'Value param \'collection\' are valids only hospital, doctor or user'})
    }

    result.
        then(results => {
            res.json({
                ok: true,
                pagination: {
                    skip,
                    limit,
                    page,
                    total: results.total
                },
                search: key,
                [collection]: results.results
            })
        })
        .catch( err => {
            handleError(res, 500, err)
        })
})

const searchUser = ( query, skip, limit  ) => {

    return new Promise( ( resolve, reject ) => {

        User.find(query, 'name email role img')
        .skip(skip)
        .limit(limit)
        .exec((err, results) => {
            if (err) return reject(err);

            User.count(query, (err, total) => {
                if (err) return reject(err);

                resolve({
                    total,
                    results
                })
            })
        })

    })

}

const searchDoctor = ( query, skip, limit  ) => {

    return new Promise( ( resolve, reject ) => {

        Doctor.find(query)
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
        .exec((err, results) => {
            if (err) return reject(err);

            Doctor.count(query, (err, total) => {
                if (err) return reject(err);

                resolve({
                    total,
                    results
                })
            })
        })

    })

}

const searchHospital = ( query, skip, limit  ) => {

    return new Promise( ( resolve, reject ) => {

        Hospital.find(query)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .exec((err, results) => {
            if (err) return reject(err);

            Hospital.count(query, (err, total) => {
                if (err) return reject(err);

                resolve({
                    total,
                    results
                })
            })
        })

    })

}


module.exports = router