
module.exports = {
  ADD_APPLICATION(someProp) {
    return {
      type: 'ADD_APPLICATION',
      payload: someProp,
    };
  },
  REMOVE_APPLICATION(id) {
    return {
      type: 'REMOVE_APPLICATION',
      id: id,
    };
  },
  POPULATE_USER_DATA(useremail, userhandle) {
    return {
      type: 'POPULATE_USER_DATA',
      email: useremail,
      handle: userhandle,
    };
  },
  ADD_SERVER(id, ip, platform, app, isActive) {
    console.log('ADD SERV ACTION');
    return {
      type: 'ADD_SERVER',
      id: id,
      ip: ip,
      platform: platform,
      app: app,
      active: isActive,
    };
  },
  REMOVE_SERVER(id) {
    return {
      type: 'REMOVE_SERVER',
      id: id,
    };
  },
  ADD_SERVER_DATA(data) {
    return {
      type: 'ADD_SERVER_DATA',
      data: data,
    };
  },
  MASS_POPULATE_SERVERS(data) {
    return {
      type: 'MASS_POPULATE_SERVERS',
      servers: data,
    };
  },

};
