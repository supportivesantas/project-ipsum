module.exports = (state = [], action) => {
  switch (action.type) {

    case 'POPULATE_SLAVE_SERVERS':
      return action.data;

    default:
      return state;
  }
};
