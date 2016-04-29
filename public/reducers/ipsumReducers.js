function getNextId(state) {
  return state.applications.reduce((maxId, app) => {
    return Math.max(app.id, maxId);
  }, -1) + 1;
}

const ipsum = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_APPLICATION':
      console.log('ADDING APP');
      return Object.assign({}, state, {
        applications: [
          {
            id: getNextId(state),
            payload: action.payload,
          },
          ...state.applications],
      });

    default:
      return state;
  }
};

module.exports = ipsum;
