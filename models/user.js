const mongoose = require('mongoose'),
    Joi = require('Joi'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    config = require('config')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean
    }
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign(this.toJSON(), config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema );

const validateUser = (user) => {
    const userSchema = {
        name: Joi.string().required().min(2).max(25),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    }

    return Joi.validate(user, userSchema)
};

exports.validate = validateUser;

exports.User = User;