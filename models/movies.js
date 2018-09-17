const mongoose = require('mongoose'),
    Joi = require('Joi'),
    {
        genreSchema
    } = require('./genres');

const movieSchema = new mongoose.Schema({
    title: String,
    numberInStock: {
        type: Number,
        require: true,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        require: true,
        default: 0
    },
    genre: {
        type: genreSchema,
        required: true,
        ref: 'Genre'
    },
});

const Movie = mongoose.model('Movie', movieSchema);

exports.Movie = Movie;