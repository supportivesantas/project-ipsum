function getNextId(state) {
  return state.applications.reduce((maxId, app) => {
    return Math.max(app.id, maxId);
  }, -1) + 1;
}

module.exports = (state = [], action) => {
  switch (action.type) {
    case 'ADD_APPLICATION':
      return Object.assign({}, state, {
        applications: [
          {
            id: getNextId(state),
            payload: action.payload,
          },
          ...state.applications],
      });

    case 'POPULATE_USER_DATA':
      return Object.assign({}, state.user, {
        email: action.email,
        handle: action.handle,
      });

    case 'ADD_SERVER':
      return Object.assign({}, state, {
        servers: [
          {
            ip: action.ip,
            platform: action.platform,
            app: action.app,
          },
          ...state.servers],
      });

      case 'ADD_SERVER_DATA':
        return Object.assign({}, state, {
          graphData: action.data,
        });

    default:
      return state;
  }
};

