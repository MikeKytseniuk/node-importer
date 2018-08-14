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
}

router.post('/addContact', (req, res) => {
    let contact = req.body;

    validateContact(req, contact);

    let errors = req.validationErrors();

    if (errors) {
        res.render('index', { errors: errors });
    } else {
        rabbitMQ.sendToQueue(JSON.stringify(contact));
        res.render('index', { message: 'Contact successfully added' });
    }

});

module.exports = router;