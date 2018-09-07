const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/feeder');
const MongoDBContact = require('../models/contact');


function updateContact(oldContact, newContact, next) {
    MongoDBContact.updateOne(oldContact, newContact, (err, result) => {
        if(err) return next(err);
        console.log('---------------------------', 'updated');
    });
}

function createContact(contact, next) {
    MongoDBContact.create(contact, (err, result) => {
        if(err) return next(err);
        console.log('---------------------------', 'created');
    });
}

function deleteContact(id, next) {
    MongoDBContact.remove({ email: id }, (err, result) => {
        if(err) return next(err);
        console.log('---------------------------', 'deleted');
    });
}

async function findContact(email, next) {

    try {
        let contact = await MongoDBContact.findOne({ email: email });

        if(!contact) {
           let newContact = await MongoDBContact.create(newContact);
           return;
        }

        let updateContact = await MongoDBContact.updateOne(oldContact, newContact);

    } catch(e) {
        next(e);
    }
    

}


module.exports = {
    update: updateContact,
    create: createContact,
    delete: deleteContact
}