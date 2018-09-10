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
        let contacts = await db.Contact.findAll({ raw: true });
        res.render('contacts', { contacts: contacts });
    } catch (e) {
        console.log(e);
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
        body: {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber
        }
    };

    let errors = validateContact(req, newContact.body);

    if (errors) {
        return res.render('editContacts', { contact: newContact, errors: errors });
    }

    newContact.action = 'update';
    let response = await rabbitMQ.sendToQueue(JSON.stringify(newContact));
    if (response) {
        res.render('editContacts', { response: response, successMsg: 'Contact successfully updated' });
    }


});

router.delete('/deleteContact', async (req, res) => {
    let email = req.body.email;

    if (!email) {
        return res.status(400).send('Bad request');
    }

    try {
        let contact = await db.Contact.findOne({ where: { email: email }, raw: true });

        if (!contact) {
            return res.send('There is no user by given id');
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
        console.log(e);
    }
});




module.exports = router;