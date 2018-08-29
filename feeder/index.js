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
const MongoDBContact = require('./models/contact');


//body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


function resolveArray(arr, limit) {
    return function lol() {
        let chunk = arr.splice(0, limit);
        return chunk;
    }
}


app.post('/notification', async (req, res) => {
    let addedContacts = req.body;

    if (!Array.isArray(addedContacts)) {
        return res.status(404).send('Bad request');
    }

    let resolve = resolveArray(addedContacts, 2);

    while(addedContacts.length) {
        compareDatabases(resolve());
    }
    
    
    res.redirect('/');
    //res.render('index', { contacts: req.body });
})

async function compareDatabases(contacts) {
    contacts.map(async elem => {
        let result = await db.Contact.find({ where: { email: elem } });
        let contact = result.get({ plain: true });

        MongoDBContact.findOne({ email: result.email }, (err, result) => {
            let newContact = {
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phoneNumber: contact.phoneNumber
            }

            if (!result) {
                MongoDBContact.create(newContact, (err, result) => {
                    console.log('---------------------------', 'Added')
                })
            }
        });
    });
}


app.use('/', (req, res) => {

    res.render('index', { contacts: 'huy' });
});


app.listen(8080);
