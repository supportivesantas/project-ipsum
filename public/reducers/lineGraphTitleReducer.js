module.exports = (state = [], action) => {
  switch (action.type) {
      case 'ADD_LINE_GRAPH_TITLE':
        return [action.title];
    default:
      return state;
  }
};
