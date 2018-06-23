const express = require('express');
const app = express();

app.use('/auth', require('./auth'));
app.use('/user', require('./user'));
app.use('/', require('./app'));

module.exports = app;