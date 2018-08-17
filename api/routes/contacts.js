const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/getContacts', async (req, res) => {
    let contacts = await db.Contact.findAll();
    res.render('contacts', { contacts: contacts })
});

router.post('/addCSVContacts', async (req, res) => {
    let csvContacts = req.body;

    res.send(await addCSVContacts(csvContacts));
});

async function addCSVContacts(contacts) {

        let newContacts = contacts.map( async contact => {
            let result = await db.Contact.findOrCreate({ where: contact });
            let created = result[1];
            let newContact = {
                contact: contact,
                added: created
            };

            return newContact;
        });

        
        return Promise.all(newContacts);
}




/* const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
let arr = [1,2,3];
let result = arr.map(async (num) => {

  await waitFor(50)
 return num + 1;
})

console.log(Promise.all(result).then(res => console.log(res)));
console.log('Done') */

module.exports = router;