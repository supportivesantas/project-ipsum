module.exports = (state = [], action) => {
  switch (action.type) {
      case 'ADD_MYAPP_HISTORY':
        return action.data;
    default:
      return state;
  }
};
