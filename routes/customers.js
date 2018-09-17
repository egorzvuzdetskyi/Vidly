const express = require('express'),
    router = express.Router(),
    {
        Customer,
        validate
    } = require('../models/customers');

const createDummyCustomer = async () => {
    const customer = new Customer({
        name: 'Egor',
        isGold: false,
        phone: '06388278678'
    });

    const result = await customer.save();

    console.log(result)
};

router.get('/', async (req, res) => {
    try {

        const result = await Customer.find({});

        res.send(result)

    } catch (e) {

        res.status(404).send(`Something went wrong`);

        console.log(e.message)

    }
});

router.get('/:id', async (req, res) => {
    try {

        const result = await Customer.findById(req.params.id);

        res.send(result)

    } catch (e) {

        res.status(404).send(`Something went wrong`);

        console.log(e.message)

    }
});

router.post('/', async (req, res) => {
    try {

        const customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold ? req.body.isGold : false,
            phone: req.body.phone
        });

        const {
            error
        } = validate(customer);

        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        ;

        const result = await user.save();

        res.send(result)

    } catch (e) {

        res.status(404).send(`Something went wrong`);

        console.log(e.message)

    }
});

router.put('/:id', async (req, res) => {
    try {

        const result = await Customer.findOneAndUpdate({
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

        const result = await Customer.findOneAndRemove({
            _id: req.params.id
        });

        res.send(result)

    } catch (e) {

        res.status(404).send(`Something went wrong`);

        console.log(e.message)

    }
});

module.exports = router;