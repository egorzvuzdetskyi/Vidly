const express = require('express'),
    router = express.Router(),
    { Movie } = require('../models/movies'),
    { Genre } = require('../models/genres')


router.get('/', async (req, res) => {
    try {

        const result = await Movie.find();

        res.send(result)

    } catch (e) {

        res.status(404).send(`Something went wrong`);

        console.log(e.message)

    }
});

router.get('/:id', async (req, res) => {
    try {

        const result = await Movie.findById(req.params.id)

        res.send(result)

    } catch (e) {

        res.status(404).send(`Something went wrong`);

        console.log(e.message)

    }
});

router.post('/', async (req, res) => {
    try {

        const genre = await Genre.findById(req.body.genre_id);

        if(!genre) throw new Error('fuck up');

        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        });

        const result = await movie.save();

        res.send(result)

    } catch (e) {

        res.status(404).send(`Something went wrong`);

        console.log(e.message)

    }
});

router.put('/:id', async (req, res) => {
    try {

        const result = await Movie.findOneAndUpdate({
            _id: req.params.id
        }, {
            ...req.body
        }, {
            new: true
        });

        res.send(result)

    } catch (e) {

        res.status(404).send(`Something went wrong`);

        console.log(e.message)

    }
});

router.delete('/:id', async (req, res) => {
    try {

        const result = await Movie.findOneAndRemove({
            _id: req.params.id
        });

        res.send(result)

    } catch (e) {

        res.status(404).send(`Something went wrong`);

        console.log(e.message)

    }
});

module.exports = router;