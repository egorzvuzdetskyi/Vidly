const express = require('express'),
    router = express.Router(),
    {
        Genre,
        validate
    } = require('../models/genres'),
    auth = require('../middleware/auth'),
    admin = require('../middleware/admin'),
    asyncMiddleware = require('../middleware/async'),
    validateObjectId = require('../middleware/validateObjectId')

const createDummyGenre = async () => {
    const genre = new Genre({
        name: 'Horror'
    });

    const result = await genre.save();

    console.log(result)
};

router.get('/', asyncMiddleware(async (req, res) => {
    const genres = await Genre.find({});
    res.json(genres)
}));

router.get('/:id', validateObjectId, async (req, res) => {
    const id = req.params.id;

    const genre = await Genre.findById(id);

    if (!genre) return res.status(404).send(`The genre with given Id: ${id} can not be find`);

    res.send(genre);
});

router.post('/', auth, asyncMiddleware(async (req, res) => {

    const genre = new Genre({
        name: req.body.name
    });


    const {error} = validate(genre);

    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }

    const result = await genre.save();
    res.send(result);

}));

router.put('/:id', asyncMiddleware(async (req, res) => {
    const result = await Genre.findOneAndUpdate({_id: req.params.id}, {
        name: req.body.name
    }, {
        new: true
    });

    res.send(result)

}));

router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
    const result = await Genre.findOneAndRemove({_id: req.params.id});

    res.send(result)
}));

module.exports = router;