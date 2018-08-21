const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const db = require('../db/index');
/* const indexRouter = require('./routes/index');
const contactsRouter = require('./routes/contacts'); */
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/feeder');
//const db = mongoose.connection;



let ContactSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    }
});

let Contact = mongoose.model('Contact', ContactSchema);

//body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.post('/notification', async (req, res) => {
    //let contacts = await db.Contact.findAll();
    console.log(req.body);
    req.body.map( async elem => {
        console.log(await db.Contact.findOne({where: {email : elem}}))
    });
    //console.log(contacts);
   res.render('index', { contacts: req.body });
})

app.use('/', (req, res) => {
    Contact.find({}, (err,result) => {
        console.log(result);
    });
    res.render('index');
});
//Routes
/* app.use('/', indexRouter);
app.use('/', contactsRouter); */


app.listen(8080);


