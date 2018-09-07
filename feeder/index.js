const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = require('./routes/index')

//body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', router);

app.use((err, req, res, next) => {
    if (err) {
        res.send(err);
    }
})

app.use((req, res, next) => {
    res.send('Cannot resolve this endpoint')
})

app.listen(8080);
