const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const indexRouter = require('./routes/index');
const contactsRouter = require('./routes/contacts');

//body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setup view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');


//Routes
app.use('/', indexRouter);
app.use('/', contactsRouter);

app.listen(5000);
