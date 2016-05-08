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
        uri: `${module.exports.baseUrl}/images?private=true`
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

  parsers: {
    list_all_servers: function (res) {
      var parsedData = {
        servers: []
      };

      var resJSON = JSON.parse(res);
      
      if (!resJSON || !resJSON.droplets) {
        return parsedData;
      }
      
      for (var idx = 0; idx < resJSON.droplets.length; idx++) {
        var droplet = resJSON.droplets[idx];
        var ip = null;

        /* get the public IPv4 address */
        for (var ifidx = 0; ifidx < droplet.networks.v4.length; ifidx++) {
          if (droplet.networks.v4[ifidx].type === 'public') {
            ip = droplet.networks.v4[ifidx].ip_address;
            break;
          }
        }
        
        var server = {
          name: droplet.name,
          /* assume it's the first ipv4 address */
          ip: ip,
          server_id: droplet.id,
          platform: 'digital_ocean',
          platformSpecific: {
            imageID: droplet.image.id,
            region: droplet.region.slug,
            size: droplet.size.slug,
            status: droplet.status
          }
        };
        parsedData.servers.push(server);
      }
      return parsedData;
    },
    list_all_images: function (res) {
      //something
    },
  },

  authorize: function(req) {
    req.options.headers = (function(username, server_id) {
      var token = req.token;
      return {'Authorization': 'Bearer ' + token};
    })();
  }
}
