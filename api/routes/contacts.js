const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const rabbitMQ = require('../../rabbit/rabbitPublisher');
const validators = require('../../validation/index');
const HTTPError = require('../../HTTPError');

router.get('/getContacts', async (req, res, next) => {
    try {
        let contacts = await db.Contact.findAll({ raw: true });
        res.render('contacts', { contacts: contacts });
    } catch (e) {
        next(new HTTPError(500, 'Database connection lost'));
    }
});


router.get('/editContact/:id', async (req, res, next) => {
    let email = req.params.id;
    if (!email) {
        return res.status(400).send('Bad request');
    }

    try {
        let contact = await db.Contact.findOne({ where: { email: email } });

        if (!contact) {
            return next(new HTTPError(404, 'There is no user by given email'));
        }

        res.render('editContacts', { contact: contact });

    } catch (e) {
        next(e);
    }

});


router.post('/editContact', async (req, res, next) => {
    let newContact = {};
    newContact.body = Object.assign({}, req.body);

    let errors = validators.validateContact(req, newContact.body);

    if (errors) {
        return res.render('editContacts', { contact: newContact.body, errors: errors });
    }

    newContact.action = 'update';
    let response = await rabbitMQ.sendToQueue(JSON.stringify(newContact));
    if (response) {
        res.render('editContacts', { response: response, successMsg: 'Contact successfully updated' });
    }


});

router.delete('/deleteContact', async (req, res, next) => {
    try {
        let email = req.body.email;

        if (!email) {
            throw new HTTPError(400, 'Email is required');
        }

        let contact = await db.Contact.findOne({ where: { email: email }, raw: true });

        if (!contact) {
            throw new HTTPError(404, 'There is no user by given email');
        }

        let contactToDelete = {
            body: contact,
            action: 'delete'
        };

        let response = await rabbitMQ.sendToQueue(JSON.stringify(contactToDelete));

        if (response) {
            res.send('Deleted').status(200);
        }

    } catch (e) {
        next(e);
    }
});


module.exports = router;