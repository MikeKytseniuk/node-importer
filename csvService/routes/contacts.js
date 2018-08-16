const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ 
    dest: 'uploads/',
    fileFilter: fileFilter
    });
const request = require('request');
const csv = require('csvtojson');


router.post('/addCSV', upload.single('csv'), async (req, res) => {

    //const readStream = fs.createReadStream(req.file.path);

    if (!req.file) {
        return res.render('index', { error: 'Invalid CSV file extenstion'});
    }

    const convertedCSV = await csv().fromFile(req.file.path);
    convertedCSV.forEach( contact => {
        request.post({
            method: 'POST',
            uri: 'http://localhost:5000/addCSVContacts',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(convertedCSV)
        }, (err, response, body) => {
            console.log(body);
        });
    });
    /* request.post({
        method: 'POST',
        uri: 'http://localhost:5000/addCSVContacts',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(convertedCSV)
    }, (err, response, body) => {
        console.log(body);
    }); */
    res.render('index', { message: 'File successfully loaded' }); 
    //readStream.pipe(csv()).pipe(res);
    //readStream.pipe(csv()).pipe(writeStream);

});


function fileFilter(req, file, cb) {
    if (file.mimetype !== 'application/vnd.ms-excel') {
        return cb(null, false);
    }

    cb(null, true);
}

module.exports = router;