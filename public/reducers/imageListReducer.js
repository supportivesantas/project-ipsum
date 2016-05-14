module.exports = (state = [], action)=> {
  switch (action.type) {
    case 'POPULATE_IMAGES':
      return action.data;
    default:
      return state;
  }
};
