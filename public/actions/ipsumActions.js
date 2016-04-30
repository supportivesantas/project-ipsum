
module.exports = {
  ADD_APPLICATION(someProp) {
    return {
      type: 'ADD_APPLICATION',
      payload: someProp,
    };
  },
  POPULATE_USER_DATA(useremail, userhandle) {
    return {
      type: 'POPULATE_USER_DATA',
      email: useremail,
      handle: userhandle,
    };
  },

};
