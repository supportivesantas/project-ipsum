var parse = require('./parse');

var sendReply = function (req, res, next) {
  var parsedResponse = {};
  
  parsedResponse = parse(req.params.action, req.platform, req.resp);
  
  res.status(200).json(parsedResponse);
};

module.exports = sendReply;