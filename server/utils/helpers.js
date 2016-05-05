var _ = require('underscore');

/*Notes 
1. the optional callback param will fire when 
   iteration over the collection has finished
2. this function will stop if the optional timeout 
   is reached before all calls have finished
*/

exports.asyncLoop = function(collection, asyncFunc, timeout, callback) {
  var lenth = 0; var completed = 0;

  // get length of the collection
  length = Array.isArray(collection) ? collection.length : Object.keys(collection).length;

  timeout ? setTimeout(null, function() {}) : null;

  // fire off asyncFunc for item in the collection
  _.each(collection, function(value, key, list) {
    asyncFunc(value)
    .then(function(data) {
      callback(null, data);
      length === ++completed ? callback() : null;
    })
    .catch(function(err) {
      console.log("Error in async loop!", err);
      callback(err);
    })
  });
}


// async function to be called.... needs adapting for the loop
//  clientServers.where('id', stat.clientServers_id)
// .fetch()
// .then(function(serverInfo) {
//   var hostname = serverInfo.hostname;
//   var ip = serverInfo.ip;
//   serverStats[stat.clientServers_id] = {
//       hostname: hostname, 
//       ip: ip, 
//       statValue: stat.statValue
//     };
//   })
//   .catch(function(err) {
//     var message = "Error while processing server totals";
//     console.log(message);
//     res.status(500).send(message, err)
//   })