const express = require('express');
const app = express();

app.use('/auth', require('./auth'));
app.use('/user', require('./user'));
app.use('/hospital', require('./hospital'));
app.use('/doctor', require('./doctor'));
app.use('/search', require('./search'));
app.use('/', require('./app'));

module.exports = app;