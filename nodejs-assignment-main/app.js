var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(4000, ()=>{
    console.log("Server is running on http://localhost:4000")
})
module.exports = app;
