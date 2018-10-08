const {
        User,
        validateUserBeforeLogin
    } = require('../models/user'),
    express = require('express'),
    router = express.Router(),
    bcrypt = require('bcrypt'),
    Joi = require('joi'),
    validate = require('../middleware/validate')

router.post('/', validate(validateUserBeforeLogin), async (req, res) => {

    let user = await User.findOne({
        email: req.body.email
    });

    if (!user) return res.status(400).send('Invalid user or password');

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
        return res.status(400).send('Invalid user or password');
    }

    const token = user.generateAuthToken();

    res.send(token);
});

module.exports = router;