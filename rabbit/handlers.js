const request = require('request');
const db = require('../db/index');
const validate = require('../validation/index');

async function addContactToDatabase(contact) {
    let newContact = {
        contact: contact,
        valid: validate(contact)
    };

    if (!newContact.valid) {
        newContact.added = false;
        return newContact;
    }

    try {
        let result = await db.Contact.findOrCreate({ where: contact }),
            isAddedToDB = result[1];

        newContact.added = isAddedToDB;
        return newContact;
    } catch (e) {
        newContact.added = false;
        return newContact;
    }
}

function sendIdToFeeder(id, isAdded, addedContacts) {
    addedContacts.count++;

    if (isAdded) {
        addedContacts.contacts.push(id);
    }

    if (addedContacts.count === 5) {
        addedContacts.count = 0;
        if (addedContacts.contacts.length) {
           makePostRequestToFeeder(addedContacts.contacts);
        }
        
        addedContacts.contacts = [];
    }
    return addedContacts;
}

function makePostRequestToFeeder(contacts) {
    request.post({
        method: 'POST',
        uri: 'http://localhost:8080/notification',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(contacts)
    });
}

module.exports = {
    sendId: sendIdToFeeder,
    addContactToDatabase: addContactToDatabase
};