import React from 'react';
import actions from '../actions/ipsumActions.js';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Link } from 'react-router';


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

  tableLinkForm(cell) {
    return (
      <Link to="/myServer">Click Me!</Link>
      );
  }

  enumFormatter(cell, row, enumObject) {
    return enumObject(cell);
  }

  getSelectedRowKeys() {
    console.log(this.refs.table.state.selectedRowKeys);
  }

  addServer(e) {
    e.preventDefault();
    this.props.dispatch(actions.ADD_SERVER('6.6.6.6', 'Azure', 'CoolAppThingy', 'True'));
  }

  removeServers(servArr) {

  }

  render() {
    return (
      <div>
        <button type="submit" onClick={this.addServer.bind(this)} > Add a server </button>
        <button onClick={this.getSelectedRowKeys.bind(this)}>Get selected row keys</button>

        <BootstrapTable ref='table' data={this.props.state.servers} striped={true} hover={true} selectRow={selectRowProp} search={true}>
          <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Server ID</TableHeaderColumn>
          <TableHeaderColumn dataField="ip" dataAlign="center" dataSort={true}>Server IP</TableHeaderColumn>
          <TableHeaderColumn dataField="platform" dataSort={true}>Platform</TableHeaderColumn>
          <TableHeaderColumn dataField="active" dataSort={true}>Active?</TableHeaderColumn>
          <TableHeaderColumn dataField="app" >Application</TableHeaderColumn>
          <TableHeaderColumn dataField="id" dataFormat={this.enumFormatter} formatExtraData={this.tableLinkForm}>Link</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

AllServers = connect(state => ({ state: state }))(AllServers);
export default AllServers;
