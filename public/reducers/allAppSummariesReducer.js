module.exports = (state = [], action) => {
  switch (action.type) {
      case 'ADD_ALL_APP_SUMMARIES':
        return action.data;
    default:
      return state;
  }
};
