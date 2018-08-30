const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const db = require('../db/index');
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/feeder');
const MongoDBContact = require('./models/contact');
const MongoDBHandlers = require('./dbHandlers/handlers');

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

    while (addedContacts.length) {
        compareDatabases(resolve());
    }

    res.redirect('/');
});

app.get('/getContacts', (req, res) => {
    MongoDBContact.find({}, (err, result) => {
        console.log(result);
    });
});


async function getContactFromRefDB(email) {
        let result = await db.Contact.find({ where: { email: email } });
        if(result) {
            return result.get({ plain: true });
        }
    
}

async function compareDatabases(contacts) {
    contacts.map(async elem => {
        let referenceContact = await getContactFromRefDB(elem.id);
        
        if (!referenceContact) {
            MongoDBHandlers.delete(elem.id);
        }

        MongoDBContact.findOne({ email: referenceContact.email }, (err, result) => {
            if (err) return console.log(err);
   
            if(!result) {
                MongoDBHandlers.create(referenceContact);
                return;
            }

            MongoDBHandlers.update(result, referenceContact);
            
        });
    });
}


app.listen(8080);
