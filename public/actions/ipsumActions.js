
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
  MASS_POPULATE_APPS(data) {
    return {
      type: 'MASS_POPULATE_APPS',
      apps: data,
    };
  },
  POPULATE_USER_DATA(userhandle) {
    return {
      type: 'POPULATE_USER_DATA',
      handle: userhandle,
    };
  },
  USER_RESET() {
    return {
      type: 'USER_RESET',
    };
  },
  ADD_SERVER(id, ip, platform, hostname, apps, isActive) {
    return {
      type: 'ADD_SERVER',
      id: id,
      ip: ip,
      platform: platform,
      hostname: hostname,
      apps: apps,
      active: isActive,
    };
  },
  REMOVE_SERVER(id) {
    return {
      type: 'REMOVE_SERVER',
      id: id,
    };
  },
  ADD_SERVER_SELECTION(data) {
    return {
      type: 'ADD_SERVER_SELECTION',
      data: data,
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
  ADD_LINE_GRAPH_TITLE(title) {
    return {
      type: 'ADD_LINE_GRAPH_TITLE',
      title: title,
    };
  },
  CHANGE_APP_SERVER_TOTALS(data) {
    return {
      type: 'CHANGE_APP_SERVER_TOTALS',
      data: data,
    };
  },
  CHANGE_CURRENT_APPNAME(data) {
    return {
      type: 'CHANGE_CURRENT_APPNAME',
      appname: data,
    };
  }
};
