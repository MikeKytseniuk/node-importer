const amqp = require('amqplib/callback_api');
const db = require('../db/index');
const validate = require('../validation/index');
const request = require('request');
/* async function addContacts(contacts) {

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
} */

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


async function getContacts() {
    try {
        let result = await db.Contact.findAll();
        return result;
    } catch (e) {
        console.log(e);
    }
}

module.exports = function getMessageFromQueue() {
    let counter = 0;
    let log = [];
    amqp.connect('amqp://localhost', (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'contact';

            ch.assertQueue(q, { durable: false });
            ch.consume(q, async msg => {

                let contact = msg.content.toString(),
                    result = await addContactToDatabase(JSON.parse(contact));
            
                counter++;

                if(counter < 3 && result.added) {
                   console.log('------------------------', result.contact.email)
                    log.push(result.contact.email);
                    
                }

                console.log('----------------', counter)
                if (counter === 2) {
                    counter = 0;
                    console.log('//////////////////////', log);
                    //console.log(JSON.parse(msg.content.toString()));
                   // let contacts = await getContacts();
                    request.post({
                        method: 'POST',
                        uri: 'http://localhost:8080/notification',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(log)
                    });
                    log = [];
                }
                

                ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(result)), { correlationId: msg.properties.correlationId });
                ch.ack(msg);
            });
        });
    });
};


