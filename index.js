require('./config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const morgan = require('morgan');

const bodyParser = require('body-parser');
// Settings
const port = process.env.PORT;

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use(require('./routes'));

// DB connection
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;

    console.log('Database \x1b[32m%s\x1b[0m', 'Online');
})

// Starting the server
app.listen(port, () => {
    console.log(`Server running on port ${port} \x1b[32m%s\x1b[0m`, 'Online');
})