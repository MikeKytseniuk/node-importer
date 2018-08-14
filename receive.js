const amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        let q = 'contact';

        ch.assertQueue(q, { durable: false });
        ch.get(q, { noAck: true}, (err, msgOrFalse) => {
            console.log(msgOrFalse);
        });
        /* ch.consume(q, msg => {
            let contact = msg.content.toString();
            console.log(JSON.parse(contact));

        }, {noAck: true}); */
    });
});