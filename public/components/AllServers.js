import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


class AllServers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  addServer(e) {
    e.preventDefault();
    this.props.dispatch(actions.ADD_SERVER('6.6.6.6', 'Azure', 'CoolAppThingy', 'True'));
  }

  removeServer(e) {
    e.preventDefault();
    this.props.dispatch(actions.REMOVE_SERVER(2));
  }
  render() {
    return (
      <div> THIS IS OUR ALL SERVERS PAGE.

        <button type="submit" onClick={this.addServer.bind(this)} > Add a server </button>
        <button type="submit" onClick={this.removeServer.bind(this)} > Remove server with ID 2</button>

        <BootstrapTable data={this.props.state.servers} striped={true} hover={true}>
          <TableHeaderColumn dataField="ip" isKey={true} dataAlign="center" dataSort={true}>Server IP</TableHeaderColumn>
          <TableHeaderColumn dataField="platform" dataSort={true}>Platform</TableHeaderColumn>
          <TableHeaderColumn dataField="app" dataSort={true}>Application</TableHeaderColumn>
          <TableHeaderColumn dataField="active" dataSort={true}>Active?</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}


AllServers = connect(state => ({ state: state }))(AllServers);
export default AllServers;
