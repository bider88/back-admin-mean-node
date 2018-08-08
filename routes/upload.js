const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');

const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const { handleError } = require('../utils');

app.use(fileUpload());

app.put('/:type/:id', (req, res) => {

    const { type, id } = req.params;

    if (!req.files) {
        return handleError(res, 400, { message: 'No files were uploaded.' });
    }

    if (!req.files.file) {
        return handleError(res, 400, { message: 'File is not valid' });
    }

    let typeValids = ['hospital', 'doctor', 'user'];
    if ( typeValids.indexOf( type ) < 0 ) {
        return handleError(res, 400, { message: 'Type alloweds are hospital, doctor or user' });
    }
    
    let file = req.files.file;
    let nameFile = file.name.split('.');
    const ext = nameFile[nameFile.length - 1];
    // allow extensions
    const extValids = ['png', 'jpg', 'jpeg', 'gif'];

    if (extValids.indexOf( ext ) < 0) {
        return handleError(res, 400, { 
            message: 'Extension alloweds ' + extValids.join(', '),
            ext 
        });
    }

    const name = id + '.png';

    file.mv(`uploads/${type}/${name}`, (err) => {
        if (err) return handleError(res, 400, err);
        
            switch(type) {
                case 'user':
                    imageUser(res, id, name)
                break;
                case 'hospital':
                    imageHospital(res, id, name)
                break;
                case 'doctor':
                    imageDoctor(res, id, name)
                break;
                default:
                    handleError(res, 400, { message: 'Values type param are valids only hospital, doctor or user' })
            }

    });
})

const imageUser = (res, id, name) => {

    if (mongoose.Types.ObjectId.isValid(id)) {
        User.findById(id, (err, userDB) => {
            if (err) {
                deleteImage('user', name);
                return handleError(res, 500, err);
            }

            if (!userDB) {
                deleteImage('user', name);
                return handleError(res, 400, { message: 'User not found'});
            }

            deleteImage('user', userDB.img);

            userDB.img = name;

            userDB.save((err, userSavedDB) => {
                if (err) {
                    return handleError(res, 500, err);
                }

                res.json({
                    ok: true,
                    user: userSavedDB,
                    img: name
                })
            })
        })
    } else {
        handleError(res, 400, { message: 'User Id not valid'});
    }
}

const imageHospital = (res, id, name) => {

    if (mongoose.Types.ObjectId.isValid(id)) {
        Hospital.findById(id, (err, hospitalDB) => {
            if (err) {
                deleteImage('hospital', name);
                return handleError(res, 500, err);
            }

            if (!hospitalDB) {
                deleteImage('hospital', name);
                return handleError(res, 400, { message: 'Hospital not found'});
            }

            deleteImage('hospital', hospitalDB.img);

            hospitalDB.img = name;

            hospitalDB.save((err, hospitalSavedDB) => {
                if (err) {
                    return handleError(res, 500, err);
                }

                res.json({
                    ok: true,
                    hospital: hospitalSavedDB,
                    img: name
                })
            })
        })
    } else {
        handleError(res, 400, { message: 'Hospital Id not valid'});
    }
}

const imageDoctor = (res, id, name) => {

    if (mongoose.Types.ObjectId.isValid(id)) {
        Doctor.findById(id, (err, doctorDB) => {
            if (err) {
                deleteImage('doctor', name);
                return handleError(res, 500, err);
            }

            if (!doctorDB) {
                deleteImage('doctor', name);
                return handleError(res, 400, { message: 'Doctor not found'});
            }

            deleteImage('doctor', doctorDB.img);

            doctorDB.img = name;

            doctorDB.save((err, doctorSavedDB) => {
                if (err) {
                    return handleError(res, 500, err);
                }

                res.json({
                    ok: true,
                    doctor: doctorSavedDB,
                    img: name
                })
            })
        })
    } else {
        handleError(res, 400, { message: 'Doctor Id not valid'});
    }
}

const deleteImage = (type, name) => {
    const pathImage = path.resolve(__dirname, `../../uploads/${type}/${name}`);
    if ( fs.existsSync(pathImage) ) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;