const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/feeder');
const MongoDBContact = require('../models/contact');



async function deleteContact(id, next) {
    try {
        await MongoDBContact.remove({ email: id });
    } catch (e) {
        next(e);
    }
}

async function addOrUpdateContact(referenceContact, next) {
    try {
        let contact = await MongoDBContact.findOne({ email: referenceContact.email });

        if (!contact) {
            await MongoDBContact.create(referenceContact);
            return;
        }

        await MongoDBContact.updateOne(contact, referenceContact);

    } catch (e) {
        next(e);
    }
}


module.exports = {
    delete: deleteContact,
    addOrUpdateContact: addOrUpdateContact
}