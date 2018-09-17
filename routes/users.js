const {
        User,
        validate
    } = require('../models/user'),
    mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    config = require('config'),
    auth = require('../middleware/auth')

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    });

    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.generateAuthToken();

    await user.save();

    res.header('x-auth-header', token).send(token);
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password');

    console.log(req.user);

    console.log(user);

    res.send(user);
});

module.exports = router;