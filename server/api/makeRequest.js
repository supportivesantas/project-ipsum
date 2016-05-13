var http = require('http');
var requestP = require('request-promise');

var makeRequest = function(req, res, next) {
  requestP(req.options)
  .then(function(resp) {
    req.resp = resp;
    next();
  })
  .catch(function(err) {
    res.status(500).send('Something broke! ' + err);
  });
}

module.exports = makeRequest;
