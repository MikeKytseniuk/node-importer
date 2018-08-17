const Joi = require('joi');
const schema = require('./schema');

module.exports = (contact) => {
    let isValid = false;

    Joi.validate(contact, schema, (err, value) => {
        isValid = err === null;
    });

    return isValid;
}