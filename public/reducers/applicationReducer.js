function getNextId(state) {
  return state.applications.reduce((maxId, app) => {
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

    default:
      return state;
  }
};

