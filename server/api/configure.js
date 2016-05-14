// var postgres = requires('')... connect to postgres
// var makeRequest = require('./makeRequest.js');
var platforms = require('./platforms');
var actions = require('./actions');
var serviceCreds = require('../db/collections/service-creds.js');

var configureRequest = function(req, res, next) {
  console.log('Request body is:', req.body);
  console.log('Request action is:', req.params.action);

  var platform = req.body.platform = 'digital_ocean'; // should come from db later
  var action = req.params.action;
  var username = req.body.username;
  var target_id = req.body.target_id;


  // check if action exists
  if (actions.indexOf(action) === -1) {
    console.log('No action matched to this api endpoint');
    res.status(404).end('No action matched to this api endpoint');
    return;
  }
  // check if platform is defined
  if (!platforms.hasOwnProperty(platform)) {
    console.log('Requested platform is not defined');
    res.status(404).end('Requested platform is not defined');
    return;
  } else {
    platform = platforms[platform];
  }

  // check if action exists for the platform
  if (!platform.actions.hasOwnProperty(action)) {
    console.log('No matching action on this platform for this api endpoint');
    res.status(404).end('No matching action on this platform for this api endpoint');
    return;
  }

  // configure request.option for makeRequest
  platform.actions[action](req);
  // attach necessary tokens
  serviceCreds.model.where({users_id: req.user.id, platform: platform.platformName})
    .fetch()
      .then((serviceCreds) => {
        req.token = serviceCreds.attributes.value;
        platform.authorize(req);
        next();
      })
      .catch((error) => {
        console.log('Error getting service credentials', error);
        platform.authorize(req);
        next();
      });
};

module.exports = configureRequest;

// example api endpoint
// api/:action

// request.body should specify the platform, username, and image/server id if applicable
// {
//   platform: "digital_ocean",
//   username: "bobby",
//   server_id: 1234567
//   image_id: 76654321
// }

// code below is for testing... uncomment and use node to start this server
// should forward the request to to Roland's DigitalOcean account (MEAN droplets)

// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');

// app.use(bodyParser.json()); // for parsing application/json
// app.use('/api/:action', configureRequest, makeRequest);

// const port = process.env.port || 8000;

// app.listen(port, (err) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log('Server listening at 127.0.0.1, port:', port);
//   }
// });



