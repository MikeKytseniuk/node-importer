const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/',
    fileFilter: fileFilter
});
const csv = require('csvtojson');
const rabbitMQ = require('../../rabbit/rabbitPublisher');


router.post('/addCSV', upload.single('csv'), async (req, res) => {
    
    if (!req.file) {
        return res.render('index', { error: 'Invalid CSV file extenstion' });
    }

    const convertedCSV = await csv().fromFile(req.file.path);
    
    let newContacts = convertedCSV.map( async elem => {
        let result = await rabbitMQ.sendToQueue(JSON.stringify(elem));
        return result;
    });

    let response = await Promise.all(newContacts);
    res.render('index', { contacts: response, message: 'File successfully loaded' });

});


function fileFilter(req, file, cb) {
    if (file.mimetype !== 'application/vnd.ms-excel') {
        return cb(null, false);
    }

    cb(null, true);
}

module.exports = router;