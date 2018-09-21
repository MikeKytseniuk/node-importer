const express = require('express');
const router = express.Router();
const rabbitMQ = require('../rabbit/rabbitPublisher');
const validators = require('../validation/index');
const HTTPError = require('../HTTPError');

/* function checkDbResponse(response) {
    return {
        statusCode: response.success ? 200: 409,
        body: response.success ? 'Contact succesfully added' : 'Contact already exists'
    }
} */

router.post('/createContact', async (req, res, next) => {
    let contact = {};
    contact.body = Object.assign({}, req.body);

    let errors = validators.validateContact(req, contact.body);

    if (errors) {
        return next(new HTTPError(400, errors));
    }

    contact.action = 'create';
    let response = await rabbitMQ.sendToQueue(JSON.stringify(contact));
    //let log = checkDbResponse(response);

    //res.status(log.statusCode).send(log.body);
    res.render('index', { contact: response }); 
});

module.exports = router;