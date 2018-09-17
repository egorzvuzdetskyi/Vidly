const mongoose = require('mongoose'),
    Joi = require('Joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 25
    }
});

const Genre = mongoose.model('Genre', genreSchema);

const validateGenre = (genre) => {
    const genreSchema = {
        name: Joi.string().required().min(5).max(50)
    };

    return Joi.validate(genre, genreSchema, {
        allowUnknown: true
    })
};

exports.validate = validateGenre;

exports.Genre = Genre;

exports.genreSchema = genreSchema;