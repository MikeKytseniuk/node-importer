const fs = require('fs');

process.on('message', async msg => {
    const stream = fs.createReadStream(msg);

    stream.on('data', async (chunk) => {
        let data = chunk.toString(),
            csvRows = data.split('\r\n'),
            csvProperties = csvRows.shift().split(','),
            transformedCSV = transormCSVToJSON(csvRows, csvProperties);

        process.send(transformedCSV);
    });

    stream.on('error', (err) => {
        process.send(err);
    });
});


function transormCSVToJSON(csvRows, csvProperties) {
    let transformedCSV = [];

    csvRows.forEach(row => {
        if (row) {
            transformedCSV.push(transformCSVRowToJSON(row.split(','), csvProperties));
        }
    })

    return transformedCSV;
}


function transformCSVRowToJSON(row, csvProperties) {
    let csvJSON = {};

    for (let i = 0; i < csvProperties.length; i++) {
        csvJSON[csvProperties[i]] = row[i];
    }

    return csvJSON;
}


