module.exports = (state = [], action) => {
  switch (action.type) {

    case 'POPULATE_LOAD_BALANCERS':
      return action.data;

    default:
      return state;
  }
};
