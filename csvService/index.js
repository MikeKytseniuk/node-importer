const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const HTTPError = require('../HTTPError');

//Routes
const indexRouter = require('./routes/index');
const contactsRouter = require('./routes/contacts');

const app = express();

//body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));


//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', indexRouter);
app.use('/contacts', contactsRouter); 

app.use((req, res, next) => {
    res.status(404).send('Cannot resove this endpoint');
});

app.use((err, req, res, next) => {
    if(err instanceof HTTPError) {
        res.render('index', { error: err.body });
    } else {
        res.send(500).status('Internal server error');
    }
});

app.listen(8000);