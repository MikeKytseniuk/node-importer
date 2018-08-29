const amqp = require('amqplib/callback_api');
const handlers = require('./handlers');

module.exports = function getMessageFromQueue() {
    let addedContacts = {
        count: 0,
        contacts: []
    }

    amqp.connect('amqp://localhost', (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'contact';

            ch.assertQueue(q, { durable: false });
            ch.consume(q, async msg => {

                let contact = msg.content.toString();

               /*  if(!contact.updated || !contact.deleted) {
               
                } */
                let result = await handlers.addContactToDatabase(JSON.parse(contact));
                addedContacts = handlers.sendId(result.contact.email, result.added, addedContacts);

                ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(result)), { correlationId: msg.properties.correlationId });
                ch.ack(msg);
            });
        });
    });
};

