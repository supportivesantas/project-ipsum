var sys = require('sys');
var exec = require('child_process').exec;

var log = function(error, stdout, stderr) {
  console.log(stdout);
};

module.exports = {
  list(nginxipandport, zone) {
    exec("wget http://" + nginxipandport + "/dynamic?upstream=" + zone, log);
  },
  enable(nginxipandport, targetipandport, zone) {
    exec("wget http://" + nginxipandport + "/dynamic?upstream=" + zone + "&server=" + targetipandport + "&up=", log);
  },
  disable(nginxipandport, targetipandport, zone) {
    exec("wget http://" + nginxipandport + "/dynamic?upstream=" + zone + "&server=" + targetipandport + "&down=", log);
  },
  add(nginxipandport, targetipandport, zone) {
    exec("wget http://" + nginxipandport + "/dynamic?upstream=" + zone + "&add=&server=" + targetipandport, log);
  },
  remove(nginxipandport, targetipandport, zone) {
    exec("wget http://" + nginxipandport + "/dynamic?upstream=" + zone + "&remove=&server=" + targetipandport + "&down=", log);
  }

};

