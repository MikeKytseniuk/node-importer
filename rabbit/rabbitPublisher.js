const amqp = require('amqplib/callback_api');

function sendToQueue(message) {
    amqp.connect('amqp://localhost', (err, conn) => {
    conn.createChannel((err, ch) => {
        let q = 'contact';
        ch.assertQueue(q, { durable: false });
        ch.sendToQueue(q, new Buffer(message));
    });
});
}

module.exports = {
   sendToQueue: sendToQueue
};