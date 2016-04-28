const ipsum = (state = [], action) => {
  switch (action.type) {
    case 'DO_THING':
      return [
        ...state,
      ];
    default:
      return state;
  }
};

export default ipsum;
