const express = require('express'),
    router = express.Router(),
    {
        Rental
    } = require('../models/rental'),
    auth = require('../middleware/auth'),
    {
        Movie
    } = require('../models/movies'),
    Joi = require('joi'),
    validate = require('../middleware/validate');

const validateReturn = (req) => {
    const genreSchema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    };

    return Joi.validate(req, genreSchema, {
        allowUnknown: true
    })
};

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('no rental');

    if(rental.dateReturned) return res.status(400).send('Rental returned is started');

    rental.return();

    await rental.save();

    await Movie.update({
        _id: rental.movie._id
    }, {
        $inc: {
            numberInStock: 1
        }
    });

    return res.send(rental);
});

module.exports = router;