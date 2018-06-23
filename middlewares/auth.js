const jwt = require('jsonwebtoken');
const { handleError } = require('../utils');

const verifyToken = (req, res, next) => {
    const token = req.get('token');

    verToken(req, res, next, token);
}

function verToken(req, res, next, token) {
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) return handleError(res, 401, err);
        req.user = decode.user;

        next();
    });
}

module.exports = {
    verifyToken
}