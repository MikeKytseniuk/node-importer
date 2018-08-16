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
    let userNotCreated = [];
    let csvContacts = req.body;
    /* csvContacts.forEach( (contact, index) => {
        try {
            db.Contact.findOrCreate({ where: contact })
                .spread((user, created) => {
                    console.log(created);
                    if(!created) {
                        csvContacts.splice(index, 1);
                        console.log('--------------------------------------------', csvContacts);
                        userNotCreated.push(user.get({plain: true}));
                       // return res.send('Contacts already exists');
                    }

                    console.log(csvContacts.length);
                    //res.status(200).send('Contacts sucessfully added');
                });
              
        } catch (e) {
           res.status(500);
        }
    }); */
    try {
        db.Contact.findOrCreate({ where: csvContacts })
            .spread((user, created) => {
                console.log(created);
                let contact = user.get({plain: true});
                if(!created) {
                  
                   return res.send(`${contact.firstName} already exists`);
                }

                console.log(csvContacts.length);
                res.status(200).send(`${contact.firstName} successfully added`);
                //res.status(200).send('Contacts sucessfully added');
            });
          
    } catch (e) {
       res.status(500);
    }
   // res.send(userNotCreated);
});


module.exports = router;