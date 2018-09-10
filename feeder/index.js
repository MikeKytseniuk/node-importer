const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = require('./routes/index')
const HTTPError = require('../HTTPError');

//body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', router);

app.use((err, req, res, next) => {
    if (err) {
        if(err instanceof HTTPError) {
            console.log('=-------------------------------', err.statusCode)
        } else {
        
        }
    }
})

app.use((req, res, next) => {
    res.send('Cannot resolve this endpoint')
})

app.listen(8080);
