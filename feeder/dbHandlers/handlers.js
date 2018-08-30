const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/feeder');
const MongoDBContact = require('../models/contact');


function updateContact(oldContact, newContact) {
    MongoDBContact.updateOne(oldContact, newContact, (err, result) => {
        console.log('---------------------------', 'updated');
    });
}

function createContact(contact) {
    MongoDBContact.create(contact, (err, result) => {
        console.log('---------------------------', 'created');
    });
}

function deleteContact(id) {
    MongoDBContact.remove({ email: id }, (err, result) => {
        console.log('---------------------------', 'deleted');
    });
}


module.exports = {
    update: updateContact,
    create: createContact,
    delete: deleteContact
}