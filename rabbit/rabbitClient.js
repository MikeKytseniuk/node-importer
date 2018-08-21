const amqp = require('amqplib/callback_api');
const db = require('../db/index');
const validate = require('../validation/index');


async function addContacts(contacts) {

    if (Array.isArray(contacts)) {
        let newContacts = contacts.map(addContactToDatabase);
        return Promise.all(newContacts);
    }

    return addContactToDatabase(contacts);
}


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
        console.log(e);
    }
}

module.exports = function getMessageFromQueue() {
    amqp.connect('amqp://localhost', (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'contact';

            ch.assertQueue(q, { durable: false });
            ch.consume(q, async msg => {
                let contact = msg.content.toString(),
                    result = await addContacts(JSON.parse(contact));

                ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(result)), { correlationId: msg.properties.correlationId });
                ch.ack(msg);
            });
        });
    });
};


