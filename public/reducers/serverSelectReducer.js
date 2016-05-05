module.exports = (state = {}, action) => {
  switch (action.type) {
      case 'ADD_SERVER_SELECTION':
        return action.data;
    default:
      return state;
  }
};
