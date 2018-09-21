const { fork } = require('child_process');
const childProcess = fork('./csvParser/csvParserChildProcess.js');


function getTransformedCSV(csvPath) {
    return new Promise((resolve, reject) => {
        childProcess.on('message', (msg) => {
            resolve(msg);
        });

        childProcess.on('error', (err) => {
            reject(error);
        });

        childProcess.send(csvPath);
    });
}

module.exports = {
    getTransformedCSV: getTransformedCSV
};