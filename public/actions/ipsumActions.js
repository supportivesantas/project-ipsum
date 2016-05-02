
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
  ADD_SERVER(ip, platform, app, isActive) {
    return {
      type: 'ADD_SERVER',
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

};
