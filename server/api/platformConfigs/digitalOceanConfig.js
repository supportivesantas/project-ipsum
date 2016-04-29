module.exports = {
  platformName: 'digital_ocean',
  baseUrl: 'https://api.digitalocean.com/v2',
  actions: {
    list_all_servers: function(req) {
      req.options = {
        method: 'GET',  
        uri: `${module.exports.baseUrl}/droplets`
      };
    },
    list_all_images: function(req) {
      req.options = {
        method: 'GET',  
        uri: `${module.exports.baseUrl}/images`
      };
    },
    delete_server: function(req) {
      if (!req.body) { throw new Error('Request body not present') }
      if (!req.body.server_id) { throw new Error('No target ID specified on req.body to be deleted') }
      req.options = {
        method: 'DELETE',  
        uri: `${module.exports.baseUrl}/droplets`, 
        body: {id: req.body.server_id},
        json: true
      };
    },
    create_server: function(req) {
      if (!req.body) { throw new Error('Request body not present') }
      if (!(req.body.name && req.body.region && req.body.size && req.body.image_id)) { 
        throw new Error('Name, region, size, or image not specified in req.body for the new server to be created.') 
      }
      req.options = {
        method: 'POST',
        uri: `${module.exports.baseUrl}/droplets`, 
        body: {
          name: req.body.name, 
          region: req.body.region, 
          size: req.body.size, 
          image: req.body.image_id
        },
        json: true
      };
    },
    reboot_server: function(req) {
      req.options = {
        method: 'POST', 
        uri: `${module.exports.baseUrl}/droplets/${req.body.server_id}/actions`, 
        body: {'type': 'reboot'},
        json: true
      };
    },
    power_on_server: function(req) {
      req.options = {
        method: 'POST', 
        uri: `${module.exports.baseUrl}/droplets/${req.body.server_id}/actions`, 
        body: {'type': 'power_on'},
        json: true
      };
    },
    power_off_server: function(req) {
      req.options = {
        method: 'POST', 
        uri: `${module.exports.baseUrl}/droplets/${req.body.server_id}/actions`, 
        body: {'type': 'power_off'},
        json: true
      };
    },
    shutdown_server: function(req) {
      req.options = {
        method: 'POST', 
        uri: `${module.exports.baseUrl}/droplets/${req.body.server_id}/actions`, 
        body: {'type': 'shutdown'},
        json: true
      };
    }
  },

  authorize: function(req) {
    req.options.headers = (function(username, server_id) {
      // TODO: get the token based on username and server_id / token join table
      var token = '3d378deef838cafa1647d6572d99efb50522395a692a33e59bbb8249ae202e50'
      //
      return {'Authorization': 'Bearer ' + token};
    })();
  }
}
