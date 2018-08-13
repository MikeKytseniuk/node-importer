const express = require('express');
const router = express.Router();
const rabbitMQ = require('../rabbit/rabbitPublisher');

router.post('/addContact', (req, res) => {
    let newContact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    };
        
    rabbitMQ.sendToQueue(JSON.stringify(newContact));
    res.redirect('/');
});

module.exports = router;