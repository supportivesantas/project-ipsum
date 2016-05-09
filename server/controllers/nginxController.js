var sys = require('sys');
var exec = require('child_process').exec;

var log = function(error, stdout, stderr) {
  console.log(stdout);
};

module.exports = {

  //NEED TO GET ID FOR REMOVE

  list(nginxipandport, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?upstream=" + zone + "&verbose=", log);
  },
  enable(nginxipandport, targetipandport, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?upstream=" + zone + "&server=" + targetipandport + "&up=", log);
  },
  disable(nginxipandport, targetipandport, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?upstream=" + zone + "&server=" + targetipandport + "&down=", log);
  },
  add(nginxipandport, targetipandport, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?add=&upstream=" + zone + "&server=" + targetipandport, log);
  },
  remove(nginxipandport, id, zone) {
    exec("curl http://" + nginxipandport + "/upstream_conf?remove=&upstream=" + zone + "&id=" + id, log);
  },

};

