import React from 'react';
import ReactDom from 'react-dom';
import actions from '../actions/ipsumActions.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import request from '../util/restHelpers';
import _ from 'underscore';
import { Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import barGraph from './AllAppsBarGraph';
import Select from 'react-select';
import style from '../styles/SelectStyle.css';

class MyAppHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterMode: 'total', // 'total', 'route', or 'server'
      filterOptions: null, // an array
      days: 7,
      graphData: null,
      selectedFilters: null
    };
  }

  componentDidMount() {
    this.getData();
  }

  graphIt(){
    if (this.state.days) {
      if (this.state.filterMode === 'total' || this.state.filterOptions && this.state.selectedFilters)
        this.formatGraphData(() => {
          if (this.state.graphData) {
            barGraph('historyBargraph', this.state.graphData);
          }
        });
    }
  }

  getData() {
    request.post('/getStats/myAppSummary', {
      userId: this.props.state.appSelection.users_id,
      appId: this.props.state.appSelection.id,
      days: this.state.days
    }, (err, resp) => {
    // parse the data object for route and server totals
      var data = JSON.parse(resp.text);
      var parsedData = this.parseHistoryResponse(data);
      // var parsedData = this.parseHistoryResponse(sampledata);
      // save parsed and formatted data to store
      this.props.dispatch(actions.ADD_MYAPP_HISTORY(parsedData));
      this.graphIt();
    });
  }

  parseHistoryResponse(response) {
    // make a copy
    var parsed = Object.assign({}, response);
    // collect server names for <Select>
    parsed.serverNames = parsed.Servers.map( Server => {
      return {
        value: Server.server,
        label: _.findWhere(this.props.state.servers, {id: Number(Server.server)} ).hostname
      };
    });
    // collect routenames for <Select>
    parsed.routeNames = parsed.Routes.map( Route => {
      return {
        value: Route.route,
        label: '/' + Route.route
      };
    });
    // collect dates for Graph
    parsed.dates = parsed.Total.map( Total => Total.date);
    // sort the totals by date
    parsed.Total.sort( (day1, day2) => (day1.date) - (day2.date));
    parsed.Routes.forEach( Route => {
      Route.data.sort( (day1, day2) => (day1.date) - (day2.date));
    });
    parsed['Servers'].forEach( Server => {
      Server.data.sort( (day1, day2) => (day1.date) - (day2.date));
    });
    return parsed;
  }

  formatGraphData(cb) {
    var mode = this.state.filterMode;

    if (mode === 'total') {

      this.setState({graphData: this.props.state.myAppHistory.Total}, cb.bind(this));
      return;

    } else  {

      if (mode === 'server') {
        var identifier = 'server';
        var raw = this.props.state.myAppHistory.Servers;
      } else {
        var identifier = 'route';
        var raw = this.props.state.myAppHistory.Routes;
      }

      var results = {};

      raw.forEach( item => {
        if (_.findWhere(this.state.selectedFilters, {value: item[identifier]})) {
          var days = item.data;
          days.forEach( day => {
            // add the label to the results if not present
            if (!results.hasOwnProperty(day.date)) {
              results[day.date] = {date: day.date, value: 0}
            }
            results[day.date].value += day.value;
          })
        }
      })

      var arr = Object.keys(results).map( key => results[key]);
      arr.sort( (a, b) => {
        return a.date - b.date;
      });

      this.setState({graphData: arr}, () => cb() );
    }
  }

  selectDays(value) {
    this.setState({days: value.value}, () => this.getData());
  }

  selectFilterMode(value) {
    // clear the old graph away
    document.getElementById('historyBargraph').innerHTML = '';

    var next = function() {
      // clear the old filter options and load the new ones
      this.setState({selectedFilters: null}, () => {
        // load the new filter options
        var mode = {
          'route': this.props.state.myAppHistory.routeNames,
          'server': this.props.state.myAppHistory.serverNames
        };

        var options = mode[value.value];
        this.setState({filterOptions: options}, () => this.graphIt() );
      });
    }

    if (value.value === 'server') { this.setState({filterMode: 'server'}, next.bind(this))}
    else if (value.value === 'route') { this.setState({filterMode: 'route'}, next.bind(this))}
    else { this.setState({filterMode: 'total', filterOptions: null, selectedFilters: null}, this.graphIt.bind(this))};

  }

  toggleFilterOption(value) {
    this.setState({selectedFilters: value}, () => {this.graphIt();});
  }

  render() {

    var dayOptions = [
      {'value': 1, 'label': '1 day'},
      {'value': 3, 'label': '3 days'},
      {'value': 7, 'label': '1 week'},
      {'value': 14, 'label': '2 weeks'},
      {'value': 28, 'label': '4 weeks'},
    ];

    var filterModes = [
      {'value': 'total', 'label': 'Total (no filter)'},
      {'value': 'route', 'label': 'By selected route(s)'},
      {'value': 'server', 'label': 'By selected server(s)'}
    ];

    return (
      <Row>
      <Col xs={12} md={12}>
      <h2>Look back</h2>
      <Panel header={<h1>Selected History</h1>}>
        <Grid fluid>
        <Row>
          <Col xs={12} md={4}>

            <div>
            <h3>How far back?</h3>
            <Select value={this.state.days} ref='daysSelect' options={dayOptions} clearable={false} name='daysSelect' onChange={this.selectDays.bind(this)} />
            </div>

            <div>
            <h3>Filter results by:</h3>
            <Select disabled={this.state.days ? false : true} value={this.state.filterMode} ref='filterModeSelect' options={filterModes} clearable={false} name='filterModeSelect' onChange={this.selectFilterMode.bind(this)} />
            </div>

            <div>
            <h3>Options</h3>
            <Select disabled={this.state.filterOptions && this.state.filterMode !== 'total' ? false : true} multi value={this.state.selectedFilters} ref='filterSelect' options={this.state.filterOptions} clearable={false} name='filterSelect' onChange={this.toggleFilterOption.bind(this)} />
            </div>

          </Col>
          <Col xs={12} md={8}>
            <h3>Selected Data</h3>
            <div id='historyBargraph'></div>

          </Col>
        </Row>
        </Grid>
      </Panel>
      </Col>
      </Row>
    )
  }
}

MyAppHistory = connect(state => ({ state: state }))(MyAppHistory);
export default MyAppHistory
