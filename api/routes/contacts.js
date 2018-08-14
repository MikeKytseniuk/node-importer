const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const getMessage = require('../../rabbit/rabbitClient');

router.get('/getContacts', async (req, res) => {

    let message = await getMessage();

    if (typeof message === 'string') {
        return res.render('contacts', { message: message, contacts: false });
    } else {
        res.render('contacts', { message: message, contacts: true });
    }

});

router.post('/addContactToDatabase', async (req, res) => {
    let contact = req.body;

    try {
        await db.Contact.findOrCreate({ where: contact })
            .spread((user, created) => {
                if (created) {
                    console.log('Created');
                    let user = user.get({ plain: true });
                    res.send(`${user} successfully added to database`);
                } else {
                    res.send(`${user} is already created`);
                }
            });
    } catch (e) {
        res.send(e);
    }
});

module.exports = router;