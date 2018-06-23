require('./config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true
    });
})

//
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;

    console.log('Database \x1b[32m%s\x1b[0m', 'Online');
})

app.listen(port, () => {
    console.log(`Server running on port ${port} \x1b[32m%s\x1b[0m`, 'Online');
})