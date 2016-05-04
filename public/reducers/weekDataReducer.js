
module.exports = (state = [], action) => {
  switch (action.type) {

    case 'ADD_WEEK_DATA':
      return action.data;

    default:
      return state;
  }
};

