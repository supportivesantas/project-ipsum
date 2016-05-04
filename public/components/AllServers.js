import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Link } from 'react-router';
import request from '../util/restHelpers.js';


const selectRowProp = {
  mode: 'checkbox',
  bgColor: 'rgb(238, 193, 213)',
};

class AllServers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  goToServer(context, servId) {
    servId = servId || 1; //1 for testing, will need to connect with clicked server
    request.post('/getStats/server',
      {serverId: servId, hours: 24}, //TODO figure out how to keep track of desired hours, have user settings/config in store?
      (err, res) => {
        if (err) { console.log("Error getting Server Data", err); }
        this.props.dispatch(actions.ADD_SERVER_DATA(res.body));
      });
  }

  tableLinkForm(cell) {
    return (
      <Link  onClick={this.goToServer.bind(this)} to="/myServer">Click Me!</Link>
      );
  }

  enumFormatter(cell, row, enumObject) {
    return enumObject(cell);
  }

  getSelectedRowKeys() {
    console.log(this.refs.table.state.selectedRowKeys);
  }

  render() {
    return (
      <div>
        <button onClick={this.getSelectedRowKeys.bind(this)}>Get selected row keys</button>

        <BootstrapTable ref='table' data={this.props.state.servers} striped={true} hover={true} selectRow={selectRowProp} search={true}>
          <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Server ID</TableHeaderColumn>
          <TableHeaderColumn dataField="ip" dataAlign="center" dataSort={true}>Server IP</TableHeaderColumn>
          <TableHeaderColumn dataField="platform" dataSort={true}>Platform</TableHeaderColumn>
          <TableHeaderColumn dataField="active" dataSort={true}>Status</TableHeaderColumn>
          <TableHeaderColumn dataField="app" >Application</TableHeaderColumn>
          <TableHeaderColumn dataField="id" dataFormat={this.enumFormatter} formatExtraData={this.tableLinkForm.bind(this)}>Link</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

AllServers = connect(state => ({ state: state }))(AllServers);
export default AllServers;
