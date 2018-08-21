const amqp = require('amqplib/callback_api');

function sendToQueue(message) {
    return new Promise((resolve, reject) => {
        
        amqp.connect('amqp://localhost', (err, conn) => {
            if(err) reject(err);
            conn.createChannel((err, ch) => {
                ch.assertQueue('', { durable: false }, (err, q) => {

                    ch.consume(q.queue, msg => {
                        let response = msg.content.toString();
                        resolve(JSON.parse(response));
                    }, { noAck: true })

                    ch.sendToQueue('contact', new Buffer(message), { replyTo: q.queue, correlationId: '123' });
                });
            });
        });
    });
}

module.exports = {
    sendToQueue: sendToQueue
};