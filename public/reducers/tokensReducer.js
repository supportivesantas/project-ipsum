
module.exports = (state = {}, action) => {
  switch (action.type) {

    case 'POPULATE_TOKENS':
      return action.data;

    default:
      return state;
  }
};

