function getNextId(state) {
  return state.reduce((maxId, app) => {
    return Math.max(app.id, maxId);
  }, -1) + 1;
}

module.exports = (state = [], action) => {
  switch (action.type) {
    case 'ADD_APPLICATION':
      return [
        {
          payload: action.payload,
        },
        ...state,
      ];

    case 'REMOVE_APPLICATION':
      return state.filter(item => item.id !== action.id);
    
    case 'MASS_POPULATE_APPS':
      return action.apps;

    default:
      return state;
  }
};

