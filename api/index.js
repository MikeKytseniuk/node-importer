const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const amqp = require('amqplib/callback_api');
const app = express();



app.use('/', (req, res) => {

    amqp.connect('amqp://localhost', (err, conn) => {
        conn.createChannel((err, ch) => {
            let q = 'contact';

            ch.assertQueue(q, { durable: false });
            ch.consume(q, msg => {
                let contact = msg.content.toString();
                res.send(JSON.parse(contact));
            }, { noAck: true });
        });
    });

  
});

app.listen(5000);