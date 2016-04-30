
module.exports = {
  ADD_APPLICATION(someProp) {
    return {
      type: 'ADD_APPLICATION',
      payload: someProp,
    };
  },
  POPULATE_USER_DATA(useremail, userhandle) {
    return {
      type: 'POPULATE_USER_DATA',
      email: useremail,
      handle: userhandle,
    };
  },
  ADD_SERVER(ip, platform, app) {
    return {
      type: 'ADD_SERVER',
      ip: ip,
      platform: platform,
      app: app,
    };
  },

};
