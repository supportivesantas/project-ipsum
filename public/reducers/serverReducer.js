function getNextId(state) {
  return state.applications.reduce((maxId, app) => {
    return Math.max(app.id, maxId);
  }, -1) + 1;
}

module.exports = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SERVER':
      return [
        {
          ip: action.ip,
          platform: action.platform,
          app: action.app,
        },
        ...state,
      ];

    default:
      return state;
  }
};

