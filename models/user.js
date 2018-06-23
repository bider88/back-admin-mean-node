const mongoose = require('mongoose');

const  uniqueValidator = require('mongoose-unique-validator');

const roleValidates = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'Rol {VALUE} is not valid'
};

const Schema = mongoose.Schema;

const userShema = new Schema({
    name: { type: String, required: [ true, 'Name is required'] },
    email: { type: String, unique: true, required: [ true, 'Email is required' ] },
    password: { type: String, required: [ true, 'Password is required' ] },
    img: { type: String, default: '' },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roleValidates },
    google: { type: Boolean, default: false }
});

userShema.methods.toJSON = function() {
    const user = this;
    let objectUser = user.toObject();
    delete objectUser.password;
    return objectUser;
}

userShema.plugin( uniqueValidator,  { message: '{PATH} must be unique' } );

module.exports = mongoose.model( 'User', userShema );