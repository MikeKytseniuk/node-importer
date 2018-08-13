const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        let q = 'contact';

        ch.assertQueue(q, { durable: false });
        ch.consume(q, msg => {
            console.log(JSON.parse(msg.content.toString()));
        }, { noAck: true });
    });
});

