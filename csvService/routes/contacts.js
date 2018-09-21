const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/',
    fileFilter: fileFilter
});
const rabbitMQ = require('../../rabbit/rabbitPublisher');
const HTTPError = require('../../HTTPError');
const csvParserHandler = require('../csvParser/csvParserHandler');

router.post('/addCSV', upload.single('csv'), async (req, res, next) => {
    try {
        if (!req.file) {
            throw new HTTPError(400, 'Invalid CSV file extension');
        }

        let convertedCSV = await csvParserHandler.getTransformedCSV(req.file.path),
            response = await sendCSVToQueue(convertedCSV);

        res.render('index', { contacts: response, message: 'File successfully loaded' });
    } catch (e) {
        next(e);
    }
});


async function sendCSVToQueue(csv) {
    let newContacts = csv.map(async elem => {
        let contact = {
            body: elem,
            action: 'create'
        };

        return rabbitMQ.sendToQueue(JSON.stringify(contact));
    });

    return Promise.all(newContacts);
}


function fileFilter(req, file, cb) {
    if (file.mimetype !== 'application/vnd.ms-excel') {
        return cb(null, false);
    }

    cb(null, true);
}

module.exports = router;