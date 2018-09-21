const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const MongoDBContact = require('../models/contact');
const makeMongoDbAction = require('../dbHandlers/handlers');
const HTTPError = require('../../HTTPError');


function resolveArray(arr, limit) {
    return function lol() {
        let chunk = arr.splice(0, limit);
        return chunk;
    }
}

async function compareDatabases(contacts, next) {
    try {
        let response = contacts.map(async elem => {
            let referenceContact = await db.Contact.findOne({ where: { email: elem.id }, raw: true }),
                mongoResponse = await makeMongoDbAction(referenceContact, elem);

            return mongoResponse;
        });
        res.status(200).send(await Promise.all(response));
    }

    catch (e) {
        next(e);
    }
}

router.get('/getContacts', async (req, res, next) => {
    try {
        let referenceContacts = await db.Contact.findAll({ raw: true }),
            mongoContacts = await MongoDBContact.find({});

        if (!referenceContacts.length && !mongoContacts.length) {
            throw new HTTPError('404', 'Contacts not found');
        }

        res.render('index', { mongoContacts: mongoContacts, postgreContacts: referenceContacts });
    } catch (e) {
        next(e);
    }
});

router.post('/notification', async (req, res, next) => {

    let addedContacts = req.body;

    if (!Array.isArray(addedContacts)) {
        return next(new HTTPError(400, 'Bad Request'));
    }

    let resolve = resolveArray(addedContacts, 2);

    while (addedContacts.length) {
        compareDatabases(resolve(), next);
    }

    res.redirect('/');
});


module.exports = router;