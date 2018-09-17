const winston = require('winston');
// require('winston-mongodb');

module.exports = function () {

    winston.exceptions.handle(new (winston.transports.File)({filename: 'uncaugthExceptions.log'}));

    winston.exceptions.handle(new (winston.transports.Console)());

    winston.add(new (winston.transports.File)({filename: 'somefile.log'}));

    winston.add(new (winston.transports.Console)());

    // winston.add(new (winston.transports.MongoDB)({
    //     db: 'mongodb://localhost:27017/Vidly',
    //     tryReconnect: true
    // }));
}