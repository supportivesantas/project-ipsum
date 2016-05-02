import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import maps from '../mappingFunctions.js';
import restHandler from '../util/restHelpers.js';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    restHandler.post('/api/list_all_servers', {}, (err, res) => {
      const servers = JSON.parse(res.text).servers;
      const serversArr = [];
      for (let i = 0; i < servers.length; i++) {
        serversArr.push(actions.ADD_SERVER(servers[i].server_id, servers[i].ip, servers[i].platform,
          servers[i].name, servers[i].platformSpecific.status));
      }
      this.props.dispatch(actions.MASS_POPULATE_SERVERS(serversArr));
    });
  }


  render() {
    return (
      <div> THIS IS OUR MAIN PAGE.
      COOL STUFF WILL GO HERE!!!!
      </div>
    );
  }
}


MainPage = connect(state => ({ state: state }))(MainPage);
export default MainPage;
