const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');

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


app.listen(8000);