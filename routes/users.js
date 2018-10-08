const {
        User,
        validateUser
    } = require('../models/user'),
    express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    bcrypt = require('bcrypt'),
    auth = require('../middleware/auth'),
    validate = require('../middleware/validate')

router.post('/', validate(validateUser), async (req, res) => {

    let user = await User.findOne({
        email: req.body.email
    });

    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.generateAuthToken();

    await user.save();

    res.header('x-auth-header', token).send({
        token
    });
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password');

    console.log(req.user);

    console.log(user);

    res.send(user);
});

module.exports = router;