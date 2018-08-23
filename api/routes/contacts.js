const express = require('express');
const router = express.Router();
const db = require('../../db/index');

router.get('/getContacts', async (req, res) => {

    try {
        let contacts = await db.Contact.findAll();
        res.render('contacts', { contacts: contacts });
    } catch (e) {
        res.render('contacts', { error: 'Database connection lost' });
    }

});


module.exports = router;