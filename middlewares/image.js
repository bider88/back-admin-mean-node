const jwt = require('jsonwebtoken');

const verifyTokenImage = (req, res,next) => {
    const { token } = req.query;

    verToken( req, res, next, token )
}

function verToken( req, res, next, token ) {
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.user = decoded.user;

        next();
    })
}

module.exports = {
    verifyTokenImage
}