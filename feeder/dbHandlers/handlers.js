const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/feeder');
const MongoDBContact = require('../models/contact');
const HTTPError = require('../../HTTPError');

async function deleteContact(id, next) {
    try {
        let deleted = await MongoDBContact.deleteOne({ email: id });

        if(!deleted.n) {
            throw new HTTPError(404, 'There is no contact by given id');
        }
   
        next('success');

    } catch (e) {
        next(e);
    }
}

async function addOrUpdateContact(referenceContact, next) {
    try {
        let contact = await MongoDBContact.findOne({ email: referenceContact.email });

        if (!contact) {
            let newContact = await MongoDBContact.create(referenceContact);
            return;
        }

        let updatedContact = await MongoDBContact.updateOne(contact, referenceContact);
        

    } catch (e) {
        next(e);
    }
}


module.exports = {
    delete: deleteContact,
    addOrUpdateContact: addOrUpdateContact
}