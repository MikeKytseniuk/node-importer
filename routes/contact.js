const express = require('express');
const router = express.Router();
const rabbitMQ = require('../rabbit/rabbitPublisher');

function validateContact(req, contact) {
    for (let prop in contact) {
        req.checkBody(prop, `${prop} field is required`).notEmpty();

        if (prop === 'email') {
            req.checkBody('email', 'email is Invalid').isEmail();
        }

    }

    return req.validationErrors();
}

router.post('/createContact', async (req, res) => {
    let contact = {
        body: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        }

    };

    let errors = validateContact(req, contact.body);

    if (errors) {
        res.render('index', { errors: errors });
    } else {
        contact.action = 'create';
        let response = await rabbitMQ.sendToQueue(JSON.stringify(contact));
        res.render('index', { contact: response });
    }

});

module.exports = router;