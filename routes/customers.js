const express = require('express'),
    router = express.Router(),
    {
        Customer,
        validate
    } = require('../models/customers'),
    asyncMiddleware = require('../middleware/async');

const createDummyCustomer = async () => {
    const customer = new Customer({
        name: 'Egor',
        isGold: false,
        phone: '06388278678'
    });

    const result = await customer.save();

    console.log(result)
};

router.get('/', asyncMiddleware(async (req, res) => {

    const result = await Customer.find({});

    res.send(result)
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    const result = await Customer.findById(req.params.id);

    res.send(result)
}));

router.post('/', asyncMiddleware(async (req, res) => {
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

    const result = await user.save();

    res.send(result)
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
    const result = await Customer.findOneAndUpdate({
        _id: req.params.id
    }, {
        ...req.body
    }, {
        new: true
    });

    res.send(result)

}));

router.delete('/:id', asyncMiddleware(async (req, res) => {
    const result = await Customer.findOneAndRemove({
        _id: req.params.id
    });

    res.send(result)
}));

module.exports = router;