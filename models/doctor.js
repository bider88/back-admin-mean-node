const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { ObjectId } = Schema.Types;

const doctorSchema = Schema({
    name: { type: String, required: [ true, 'Name is required' ] },
    img: { type: String, default: '' },
    user: { type: ObjectId, ref: 'User', required: true },
    hospital: { type: ObjectId, ref: 'Hospital', required: [true, 'Hospital Id is required'] }
});

module.exports = mongoose.model('Doctor', doctorSchema);