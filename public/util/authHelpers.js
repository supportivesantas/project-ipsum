
const getCookie = (name) => {
  const regexp = new RegExp('(?:^' + name + '|;\s*' + name + ')=(.*?)(?:;|$)', 'g');
  const result = regexp.exec(document.cookie);
  return (result === null) ? null : result[1];
};

module.exports = {

  requireAuth(nextState, replace) {
    const temp = getCookie('il');

    if (!temp) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  },


  logout() {
    document.cookie = 'il=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  },

};


