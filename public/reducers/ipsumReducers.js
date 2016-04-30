function getNextId(state) {
  return state.applications.reduce((maxId, app) => {
    return Math.max(app.id, maxId);
  }, -1) + 1;
}

export default (state = [], action) => {
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


    default:
      return state;
  }
};

