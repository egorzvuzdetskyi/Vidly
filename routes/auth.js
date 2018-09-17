const {
        User
    } = require('../models/user'),
    express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    bcrypt = require('bcrypt'),
    Joi = require('joi'),
    jwt = require('jsonwebtoken'),
    config = require('config')

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: rewq.body.email
    });

    if (!user) return res.status(400).send('Invalid user or password');

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
        res.status(400).send('Invalid user or password');
    }

    const token = user.generateAuthToken();

    res.send(token);
});

const validate = (request) => {
    const userSchema = {
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    }

    return Joi.validate(request, userSchema)
};

module.exports = router;