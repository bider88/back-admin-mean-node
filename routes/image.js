
const express = require('express');

const fs = require('fs');
const path = require('path');

const { verifyTokenImage } = require('../middlewares/image');

const app = express();

app.get('/:type/:img', verifyTokenImage, (req, res) => {
    const { type, img } = req.params;

    const pathImage = path.resolve(__dirname, `../uploads/${type}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile( pathImage );    
    } else {
        const pathNoImage = path.resolve( __dirname, '../assets/noimage.png' );

        res.sendFile( pathNoImage );
    }
})

module.exports = app;