const amqp = require('amqplib/callback_api');

module.exports = function getMessageFromQueue() {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost', (err, conn) => {
            if (err) reject(err);
            conn.createChannel((err, ch) => {
                let q = 'contact';

                ch.assertQueue(q, { durable: false });
                ch.get(q, { noAck: true}, (err, msg) => {
                    if(!msg) {
                        return resolve('There are no contacts sent');
                    }
                    
                    let contact = msg.content.toString();
                    resolve(JSON.parse(contact));
                });
            });
        });
    });

}
