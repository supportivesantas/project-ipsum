
module.exports = (state = {}, action) => {
  switch (action.type) {

    case 'POPULATE_USER_DATA':
      return Object.assign({}, {
        isLogged: !state.isLogged,
        handle: action.handle,
      });

    default:
      return state;
  }
};

