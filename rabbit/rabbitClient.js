const amqp = require('amqplib/callback_api');
const db = require('../db/index');

function addContactToDatabase(contact) {

    try {
        db.Contact.findOrCreate({ where: contact })
            .spread((user, created) => {
                console.log(created);
            });
    } catch (e) {
        console.log(e);
    }

}

module.exports = function getMessageFromQueue() {
    amqp.connect('amqp://localhost', (err, conn) => {
        if (err) reject(err);
        conn.createChannel((err, ch) => {
            let q = 'contact';

            ch.assertQueue(q, { durable: false });
            ch.consume(q, msg => {
                let contact = msg.content.toString();

                addContactToDatabase(JSON.parse(contact));

            }, { noAck: true });
        });
    });
};