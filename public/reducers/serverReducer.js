function getNextId(state) {
  return state.reduce((maxId, app) => {
    return Math.max(app.id, maxId);
  }, -1) + 1;
}

module.exports = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SERVER':
      return [
        {
          id: getNextId(state),
          ip: action.ip,
          platform: action.platform,
          app: action.app,
          active: action.active,
        },
        ...state,
      ];

    case 'REMOVE_SERVER':
      return state.filter(item => item.id !== action.id);

    default:
      return state;
  }
};
