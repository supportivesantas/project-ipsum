function getNextId(state) {
  return state.applications.reduce((maxId, app) => {
    return Math.max(app.id, maxId);
  }, -1) + 1;
}

module.exports = (state = {}, action) => {
  switch (action.type) {

    case 'POPULATE_USER_DATA':
      return Object.assign({}, state.user, {
        email: action.email,
        handle: action.handle,
      });

    default:
      return state;
  }
};

