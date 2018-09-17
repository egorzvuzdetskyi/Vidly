const mongoose = require('mongoose'),
    Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    phone: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 12
    }
});

const validateUser = (customer) => {
    const customerSchema = {
        name: Joi.string().required().min(2),
        isGold: Joi.boolean().required(),
        phone: Joi.string().required().min(8).max(12)
    }

    return Joi.validate(customer, customerSchema)
};

const Customer = mongoose.model('Customer', customerSchema);

exports.validate = validateUser;

exports.Customer = Customer;