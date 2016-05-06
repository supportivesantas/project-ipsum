module.exports = (state = [], action) => {
  switch (action.type) {
      case 'CHANGE_CURRENT_APPNAME':
        return action.appname;
    default:
      return state;
  }
};
