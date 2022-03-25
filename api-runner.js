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
const inputCsvFilename = args[3];
const collectionName = path.resolve(args[2]);
const outputFilename = 'response.csv';

const outputData = [];

//it extracts the data from the API-Response that we want to output in .csv file and return it.
let formatResponse = (resObj) => {
    let formattedData;
    
    if(resObj && resObj.data && resObj.data.id){
        formattedData = {
            id: resObj.data.id,
            email: resObj.data.email,
            first_name: resObj.data.first_name,
            last_name: resObj.data.last_name,
            avatar: resObj.data.avatar
        }
    }else{
        formattedData = { id: '', email: '', first_name: '', last_name: '', avatar: ''}
    }
    
    return formattedData;
}

//to output the data in a csv file that is gonna create in this repo
function outputsInCsvFile(outputData){
    const csvWriter = createCsvWriter({
        path: `${__dirname}/${outputFilename}`,
        header: [
            {id: "id", title: "id"},
            {id: 'email', title: 'email'},
            {id: 'first_name', title: 'first_name'},
            {id: 'last_name', title: 'last_name'},
            {id: 'avatar', title: 'avatar'},
        ]
    });
    
    csvWriter.writeRecords(outputData)
    .then(() => {
        console.log('Collection run completed.');
        console.log('Please look into the dir a',outputFilename,'file is created.');
    });
}

newman.run({
    collection: require(collectionName),
    reporters: 'cli',
    iterationData: inputCsvFilename,
    delayRequest: 100,
    timeoutRequest: 5000,
    envVar
})
.on('request', (err, data) => {
    //runs after getting response of each request
    if(err){
        console.log('Error in API hitting ->'+err);
        return;
    }

    let reqName = data.item.name;
    let res = data.response.stream.toString();
    let resObj = JSON.parse(res)
    //console.log('json res is :', resObj);
    
    console.log('\nResponse is--->', resObj);
    let formattedResponse = formatResponse(resObj)
    outputData.push(formattedResponse);

    /*do something by recognising APIs by their postman-name
    ex-> if(reqName === 'get user info')
            { 
                1. extract userid from response and put in env-variables.
                2. it then consumed by next api, let's say by 'update user by userid'
            }
         if(reqName === 'update user by userid')
            {
                1. Now, delete the userid from env-variables that we saved from 'get user info' api
            }
    */

})
.on('done', function (err, summary) {
    if (err || summary.error) {
        console.error('collection run encountered an error.');
    }
    else {
        // console.log(outputData);
        outputsInCsvFile(outputData); //to save the output data to csv file.
    }
});