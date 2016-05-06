var express = require('express');
var libstats = require('./lib/libstats');
var app = express();

app.use(libstats.initClient(app, {
  username: 'zelifus',
  name: 'test',
  url: 'http://localhost:1337/stats',
  interval: 5000
}));

app.get('/*', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
