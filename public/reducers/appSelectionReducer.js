module.exports = (state = [], action) => {
  switch (action.type) {
      case 'ADD_APP_SELECTION':
        return action.data;
    default:
      return state;
  }
};
