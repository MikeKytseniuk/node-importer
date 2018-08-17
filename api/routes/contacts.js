const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const validate = require('../../validation/index');


router.get('/getContacts', async (req, res) => {
    let contacts = await db.Contact.findAll();
    res.render('contacts', { contacts: contacts })
});

router.post('/addCSVContacts', async (req, res) => {
    let csvContacts = req.body;

    res.send(await addCSVContacts(csvContacts));
});

async function addCSVContacts(contacts) {
    let newContacts = contacts.map(async contact => {

        let newContact = {
            contact: contact,
            valid: validate(contact)
        };

        if (!newContact.valid) {
            newContact.added = false;
            return newContact;
        }

        let result = await db.Contact.findOrCreate({ where: contact }),
            isAddedToDB = result[1];

        newContact.added = isAddedToDB;
        return newContact;
    });


    return Promise.all(newContacts);
}

module.exports = router;