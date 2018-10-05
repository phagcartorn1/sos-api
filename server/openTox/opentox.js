var OpenTok = require('opentok');
const axios = require('axios')

const apiKey = '46198462';
const apiSecret = 'f57c85fefb08425a7dd3842ddef0a306fbc1a7ca';
var opentok = new OpenTok(apiKey, apiSecret);


var sendSignal = (payload,sessionId,callback) => {

//     payload  {
//             "type": "agentAccepted", "data": "agentAccepted"
//         }
      
    var SESSION_ID = sessionId;


    // Signal
    axios.post(`https://api.opentok.com/v2/project/${apiKey}/session/${SESSION_ID}/signal`,
        payload,
        { headers: { 'X-TB-PARTNER-AUTH': apiKey + ":" + apiSecret, 'Content-Type': 'application/json' } }).then((response) => {

            callback(response,null)
        }).catch((e) => {
            callback(null,e)
        })


}


module.exports = { opentok , sendSignal }