//to defines environment variables of postman-collection

//value-field contains initial-value of variable. if initial-value is null then keep it as an empty string.

const envVar = [
    {
        "key": "id",
        "value": ""
    },
    {
        "key": "requestId",
        "value": ""
    },
    {
        "key": "activityId",
        "value": ""
    },
    {
        "key": "prospectId",
        "value": ""
    },
    {
        "key": "startTime",
        "value": ""
    },
    {
        "key": "endTime",
        "value": ""
    },
    {
        "key": "recordingURL",
        "value": ""
    },
    {
        "key": "customerNum",
        "value": ""
    },
    {
        "key": "CallDuration",
        "value": ""
    }
]

module.exports = envVar;

// {
//     "name": "newman--get prospectId from requestId",
//     "event": [
//         {
//             "listen": "prerequest",
//             "script": {
//                 "exec": [
//                     ""
//                 ],
//                 "type": "text/javascript"
//             }
//         }
//     ],
//     "request": {
//         "method": "GET",
//         "header": [
//             {
//                 "key": "x-api-key",
//                 "value": "0y5gKfvf9g8813YoLIFqO4nkSgo3wQaL9BtpLivQ"
//             }
//         ],
//         "url": {
//             "raw": "https://asyncapi-in21.leadsquared.com/1/api/telephony/logcallcomplete/status?RequestID={{requestId}}",
//             "protocol": "https",
//             "host": [
//                 "asyncapi-in21",
//                 "leadsquared",
//                 "com"
//             ],
//             "path": [
//                 "1",
//                 "api",
//                 "telephony",
//                 "logcallcomplete",
//                 "status"
//             ],
//             "query": [
//                 {
//                     "key": "RequestID",
//                     "value": "{{requestId}}"
//                 }
//             ]
//         }
//     },
//     "response": []
// },