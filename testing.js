const newman = require('newman');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const envVar = require('./postman_env_variables');

const args = process.argv;
if(args.length <= 3){
    console.error("\nInsufficient Arguments. Ex -> node script.js FILEPATH-of-postman-collection.json FILEPATH-of-input-data-file.csv\n")
    return;
}
console.log(args);
const inputCsvFilename = args[3]//'./unacademy logs - temp.csv';
const outputFilename = 'response.csv';
const collectionName = path.resolve(args[2])//'./newman.postman_collection.json';

const outputData = [];
//extract the data from the API-Response that we want to output in .csv file
// and return from this function
let formatResponse = (resObj) => {
    let formattedData;
    
    if(resObj.TaskStatus && resObj.TaskStatus.Status === 'Success'){
        formattedData = {
            RequestId: resObj.RequestId,
            Data: resObj.TaskStatus.RequestBody,
            Status: resObj.TaskStatus.Status
        }
    }else{
        formattedData = {
            RequestId: resObj.RequestId,
            Data: "",
            Status: 'Not Found'
        }
    }
    
    return formattedData;
}

//to output the data in a csv file that is gonna create in this repo
function outputsInCsvFile(outputData){
    // console.log('filename would be: ',`${__dirname}/${outputFilename}`)
    const csvWriter = createCsvWriter({
        path: `${__dirname}/${outputFilename}`,
        header: [
            {id: "RequestId", title: "RequestId"},
            {id: 'Data', title: 'ActivityId'},
            {id: 'Status', title: 'Status'}
        ]
    });
    
    csvWriter.writeRecords(outputData)
    .then(() => {
        console.log(outputFilename,'file is created.');
    });
}

newman.run({
    collection: require(collectionName),
    reporters: 'cli',
    iterationData: inputCsvFilename,
    delayRequest: 100,
    envVar
})
.on('request', (err, data) => {
    if(err){
        console.log('Error in API hitting ->'+err);
        return;
    }

    let res = data.response.stream.toString();
    let resObj = JSON.parse(res)
    //console.log('json res is :', resObj);

    outputData.push(formatResponse(resObj));
})
.on('done', function (err, summary) {
    if (err || summary.error) {
        console.error('collection run encountered an error.');
    }
    else {
        console.log(outputData);
        // outputsInCsvFile(outputData);
        console.log('collection run completed.');
    }
});