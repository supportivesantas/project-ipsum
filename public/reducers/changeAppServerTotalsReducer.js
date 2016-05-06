module.exports = (state = [], action) => {
  switch (action.type) {
      case 'CHANGE_APP_SERVER_TOTALS':
        return action.data;
    default:
      return state;
  }
};
