const amqp = require('amqplib/callback_api');
const handlers = require('./handlers');

module.exports = function getMessageFromQueue() {
    let addedContacts = {
        count: 0,
        body: []
    }

    amqp.connect('amqp://localhost', (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'contact';

            ch.assertQueue(q, { durable: false });
            ch.consume(q, async msg => {

                let contact = msg.content.toString();
                contact = JSON.parse(contact);
                
                let result = await handlers[contact.action](contact);
                addedContacts = await handlers.sendIdToFeeder(result.body.email, result.action, result.success, addedContacts);

                ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(result)), { correlationId: msg.properties.correlationId });
                ch.ack(msg);
            });
        });
    });
};

