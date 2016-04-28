const ipsum = (state = [], action) => {
  switch (action.type) {
    case 'DO_THING':
      return [
        ...state, { payload: action.payload },
      ];
    default:
      return state;
  }
};

module.exports = ipsum;
