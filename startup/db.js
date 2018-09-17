const winston = require('winston'),
    mongoose = require('mongoose'),
    config = require('config')

module.exports = function () {
    const db = config.get('db');
    mongoose.connect(db)
        .then(() => winston.info(`Connected to ${db}`))
        .catch(err => winston.error(err.message, err));
}