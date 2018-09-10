const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/feeder');
const MongoDBContact = require('../models/contact');
const MongoDBHandlers = require('../dbHandlers/handlers');

function resolveArray(arr, limit) {
    return function lol() {
        let chunk = arr.splice(0, limit);
        return chunk;
    }
}

async function getContactFromRefDB(email) {
    let result = await db.Contact.find({ where: { email: email } });
    if (result) {
        return result.get({ plain: true });
    }
}

async function compareDatabases(contacts, next) {
    contacts.map(async elem => {
        try {
            let referenceContact = await getContactFromRefDB(elem.id);
            if (!referenceContact) {
                MongoDBHandlers.delete(elem.id, next);
                return;
            }

            MongoDBHandlers.addOrUpdateContact(referenceContact, next);
        } catch (e) {
            next(e);
        }
    });
}

router.get('/getContacts', async (req, res, next) => {
    try {
        let referenceContacts = await db.Contact.findAll(),
            mongoContacts = await MongoDBContact.find({});
            
        res.render('index', { mongoContacts: mongoContacts, postgreContacts: referenceContacts });
    } catch (e) {
        next(e);
    }
});

router.post('/notification', async (req, res, next) => {

    let addedContacts = req.body;

    if (!Array.isArray(addedContacts)) {
        return res.status(404).send('Bad request');
    }

    let resolve = resolveArray(addedContacts, 2);

    while (addedContacts.length) {
        compareDatabases(resolve(), next);
    }

    res.redirect('/');
});


module.exports = router;