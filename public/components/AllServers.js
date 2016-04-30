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

  render() {
    return (
      <div> THIS IS OUR ALL SERVERS PAGE.
      List of all apps goes here.
        <BootstrapTable data={this.props.state.servers} striped={true} hover={true}>
          <TableHeaderColumn dataField="ip" isKey={true} dataAlign="center" dataSort={true}>Server IP</TableHeaderColumn>
          <TableHeaderColumn dataField="platform" dataSort={true}>Platform</TableHeaderColumn>
          <TableHeaderColumn dataField="app" >Application</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}


AllServers = connect(state => ({ state: state }))(AllServers);
export default AllServers;
