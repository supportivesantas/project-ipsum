var express = require('express');
var libstats = require('./lib/libstats');
var app = express();

app.use(libstats.initClient(app, {
  username: 'zelifus',                /* github username    */
  name: 'test',                       /* app name           */
  url: 'http://localhost:1337/stats', /* url to controller  */
  port: 8080,                         /* app port number    */
  interval: 5000                      /* reporting interval */
}));

app.get('/*', function (req, res) {
  res.send('Hello World');
});

var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});
