const amqp = require('amqplib/callback_api');
const db = require('../db/index');
const validate = require('../validation/index');
const request = require('request');

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

function sendContactsToFeeder(contacts) {
    request.post({
        method: 'POST',
        uri: 'http://localhost:8080/notification',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(contacts)
    });
}

module.exports = function getMessageFromQueue() {
    let counter = 0,
        addedContacts = [];
    amqp.connect('amqp://localhost', (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'contact';

            ch.assertQueue(q, { durable: false });
            ch.consume(q, async msg => {

                let contact = msg.content.toString(),
                    result = await addContactToDatabase(JSON.parse(contact));

                counter++;

                if (result.added) {
                    addedContacts.push(result.contact.email)
                }

                if (counter === 5) {
                    counter = 0;
                    if (addedContacts.length) {
                        sendContactsToFeeder(addedContacts);
                    }
                    addedContacts = [];
                }

                ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(result)), { correlationId: msg.properties.correlationId });
                ch.ack(msg);
            });
        });
    });
};

