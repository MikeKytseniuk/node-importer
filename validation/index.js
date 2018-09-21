const Joi = require('joi');
const schema = require('./schema');

module.exports = {
    joiValidation: function (contact) {
        let isValid = false;

        Joi.validate(contact, schema, (err, value) => {
            isValid = err === null;
        });

        return isValid;
    },

    validateContact: function (req, contact) {
        for (let prop in contact) {
            req.checkBody(prop, `${prop} field is required`).notEmpty();
    
            if (prop === 'email') {
                req.checkBody('email', 'email is Invalid').isEmail();
            }
    
        }
    
        return req.validationErrors();
    }
}; 