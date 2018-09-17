const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const users = require('../routes/users');
const movies = require('../routes/movies');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function (app) {

    app.use(express.urlencoded(
        {extended: true}
    ));

    // app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello world!');
    });

    app.use('/api/genres', genres);

    app.use('/api/customer', customers);

    app.use('/api/movies', movies);

    app.use('/api/users', users);

    app.use('/api/auth', auth);

    app.use('/api/returns', returns);

    app.use(error);

};