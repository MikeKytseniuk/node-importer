const request = require('request');
const db = require('../db/index');
const validators = require('../validation/index');


async function getContactByEmail(email) {
    try {
        let contact = await db.Contact.findOne({ where: { email: email } });
        return contact;
    } catch (e) {
        console.log(e);
    }
}

async function updateContact(contact) {

    try {
        let newContact = await getContactByEmail(contact.body.email);
        result = await newContact.update(contact.body);

        contact.success = Boolean(result);
        return contact;

    } catch (e) {
        console.log(e);
    }
}

async function deleteContact(contact) {
    try {
        let contactToDelete = await getContactByEmail(contact.body.email),
            result = await contactToDelete.destroy();

        contact.success = Boolean(result);
        return contact;

    } catch (e) {
        console.log(e);
    }
}

async function createContact(contact) {
    let newContact = {
        body: contact.body,
        valid: validators.joiValidation(contact.body),
        action: contact.action
    };

    if (!newContact.valid) {
        newContact.success = false;
        return newContact;
    }

    try {
        let result = await db.Contact.findOrCreate({ where: contact.body }),
            isAddedToDB = result[1];
        newContact.success = isAddedToDB;
        return newContact;
    } catch (e) {
        newContact.success = false;
        return newContact;
    }
}

function sendIdToFeeder(id, action, successFlag, contacts) {
    contacts.count++;

    if (successFlag) {
        let log = {
            id: id,
            action: action
        };

        contacts.body.push(log);
    }

    if (contacts.count === 2) {
        contacts.count = 0;
        if (contacts.body.length) {
            makePostRequestToFeeder(contacts.body);
        }

        contacts.body = [];
    }
    return contacts;
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
    update: updateContact,
    delete: deleteContact,
    create: createContact,
    sendIdToFeeder: sendIdToFeeder
}