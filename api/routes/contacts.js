const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const rabbitMQ = require('../../rabbit/rabbitPublisher');

function validateContact(req, contact) {
    for (let prop in contact) {
        req.checkBody(prop, `${prop} field is required`).notEmpty();

        if (prop === 'email') {
            req.checkBody('email', 'email is Invalid').isEmail();
        }

    }

    return req.validationErrors();
}



router.get('/getContacts', async (req, res) => {

    try {
        let contacts = await db.Contact.findAll();
        res.render('contacts', { contacts: contacts });
    } catch (e) {
        res.render('contacts', { error: 'Database connection lost' });
    }

});


router.get('/editContact/:id', async (req, res) => {
    let email = req.params.id;
    if (!email) {
        return res.status(400).send('Bad request');
    }

    try {
        let contact = await db.Contact.findOne({ where: { email: email } });

        if (!contact) {
            return res.render('editContacts', { message: 'There is no user by given email' });
        }

        res.render('editContacts', { contact: contact });

    } catch (e) {
        console.log(e);
    }

});


router.post('/editContact', async (req, res) => {
    let newContact = {
        contact: {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber
        }

    };

    let errors = validateContact(req, newContact.contact);

    if (errors) {
        return res.render('editContacts', { contact: newContact, errors: errors });
    }

    try {
        let contact = await db.Contact.findOne({ where: { email: newContact.contact.email } });
        let result = await contact.update(newContact.contact);

        if (result) {
            newContact.updated = true;
            rabbitMQ.sendToQueue(JSON.stringify(newContact));
            res.render('editContacts', { response: result, successMsg: 'Contact successfully updated' });
        }


    } catch (e) {
        console.log(e);
    }

});

router.delete('/deleteContact', async (req, res) => {
    let email = req.body.email;

    if (!email) {
        return res.status(400).send('Bad request');
    }

    try {
        let contact = await db.Contact.findOne({ where: { email: email } });

        if (!contact) {
            return res.send('There is no user by given id');
        }

        let result = await contact.destroy();
        if (result) {

            let newContact = {
                contact: {
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    phoneNumber: contact.phoneNumber
                },
                deleted: true
            };

            rabbitMQ.sendToQueue(JSON.stringify(newContact));

        }
        res.send('Deleted').status(200);
    } catch (e) {
        console.log(e);
    }

});


module.exports = router;