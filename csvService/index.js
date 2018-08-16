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

//Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
      
      while(namespace.length) {
        formParam += '[' + namespace.shift();
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      }
    }
}));

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', indexRouter);
app.use('/contacts', contactsRouter); 


app.listen(8000);