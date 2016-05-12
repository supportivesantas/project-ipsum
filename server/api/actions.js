var actions = [
  'list_all_servers',
  'list_all_images',      
  'delete_server',
  'get_server',                /* get server info for one server by server_id                       */
  'get_server_pltfm_specific', /* get all platform specific info needed to create a server          */
  'create_server',             /* creates new server with existing image id and pltfm specific info */
  'reboot_server',   
  'power_on_server', 
  'power_off_server',
  'shutdown_server' 
];

module.exports = actions;