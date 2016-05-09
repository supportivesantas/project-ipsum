import React from 'react';
import ReactDom from 'react-dom';
import actions from '../actions/ipsumActions.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import request from '../util/restHelpers';
import _ from 'underscore';
import { Panel, Grid, Row, Col, Clearfix, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import barGraph from './BarGraph';
import Select from 'react-select';
import styles from '../styles/SelectStyle.css';
import { Chart } from 'react-d3-core';
import { BarStackZoom } from 'react-d3-zoom';

const dayOptions = [
    { value: 1, label: '1 days' },
    { value: 3, label: '3 days' },
    { value: 7, label: '7 days' },
    { value: 14, label: '14 days' },
    { value: 21, label: '21 days' },
    { value: 30, label: '30 days' }
  ];

const filterOptions = [
  {value: 'total', label: 'Do not filter'},
  {value: 'route', label: 'Selected Routes'},
  {value: 'server', label: 'Selected Servers'}
];

var sampledata = {
  "Total": [ 
    {date: 20160508, value: 1234}, 
    {date: 20160509, value: 2846}
  ],
  "Routes": [
    {route: 'route1', data: 
      [{
        "route": "route1",
        "date": 752016,
        "value": 1158836
      },
      {
        "route": "route1",
        "date": 852016,
        "value": 26213
      }]
    },
    {route: 'route2', data: 
      [{
        "route": "route2",
        "date": 752016,
        "value": 1158836
      },
      {
        "route": "route2",
        "date": 852016,
        "value": 26213
      }]
    }],
  "Servers": [
    {serverid: 'server1', data: 
      [{
        "serverid": "server1",
        "date": 752016,
        "value": 1158836
      },
      {
        "serverid": "server1",
        "date": 852016,
        "value": 26213
      }]
    },
    {serverid: 'server2', data: 
      [{
        "serverid": "server2",
        "date": 752016,
        "value": 1158836
      },
      {
        "serverid": "server2",
        "date": 852016,
        "value": 26213
      }]
    }
  ]
};

class MyAppHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterMode: 'route', // 'total', 'route', or 'server'
      filterOptions: [], // an array 
      days: 7,
      graphData: null,
      chartSeries: null
    };
  }

  componentWillMount(){
    this.getData();
  }

  getData() {
    // request.post('/getStats/serverTotalsForApp', {
    //   userid: 1,
    //   appid: 1,
    //   days: 1
    // }, (err, resp) => {
    // parse the data object for route and server totals
      // var data = JSON.parse(resp.text);
      var parsedData = this.parseHistoryResponse(sampledata);
      // save parsed and formatted data to store
      this.props.dispatch(actions.ADD_MYAPP_HISTORY(parsedData));
      this.formatGraphData();
    // });
  }


  parseHistoryResponse(response) {
    // make a copy
    var parsed = Object.assign({}, response);
    // collect server names for <Select>
    parsed.serverNames = parsed.Servers.map( Server => {return {value: Server.serverid, label: Server.serverid}; });
    // collect routenames for <Select>
    parsed.routeNames = parsed.Routes.map( Route => {return {value: Route.route, label: Route.route}; });
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

  formatGraphData() {
    var data = this.props.state.myAppHistory;
    var mode = this.state.filterMode;

    if (mode === 'total') {
      this.setState({chartSeries: [{field: 'value', name: 'Total'}]});
      this.setState({graphData: data.Total});
    } else if (mode === 'server') {
      var results = {};
      var raw = this.props.state.myAppHistory.Servers[0].data;
      raw.forEach( item => {
        if ( this.state.filterMode !== 'total' && this.state.filterOptions.indexOf(item.serverId) === -1 ) { return; }
        if (!results.hasOwnProperty(item.date)) {
          results[item.date] = {date: item.date};
        }
        var day = results[item.date];
        if (!day.hasOwnProperty(item.serverId)) {
          day[item.serverId] = 0;
        }
        day.serverId += item.value;
      })
      results = Object.keys(results).map(key => results.key);
      this.setState({graphData: results})
    } else {
      var results = {}
      var raw = this.props.state.myAppHistory.Routes[0].data;
      raw.forEach( item => {
        if ( this.state.filterMode !== 'total' && this.state.filterOptions.indexOf(item.route) === -1 ) { return; }
        if (!results.hasOwnProperty(item  .date)) {
          results[item.date] = {date: item.date};
        }
        var day = results[item.date];
        if (!day.hasOwnProperty(item.routes)) {
          day[item.route] = 0;
        }
        day.route += item.value;
      })
      results = Object.keys(results).map(key => results.key);
      this.setState({graphData: results})
    }
  }

  selectDay(value) {
    this.setState({days: value.value}, () => { this.getData() });
  }
  
  selectFilterMode(value) {
    this.setState({filterOptions: null}, () => {
      if (value) {
        this.setState({filterMode: value.value}); 
      }
    })
  }

  selectFilterOptions(value) {
    this.setState({filterOptions: _.pluck(value, 'value')});
  }

  render() {

    var width = 500,
        height = 400,
        title = "Selected Data",
        // what fields you want to build in the chart
        // field is for the field in your csv field
        // name is for the name you want to show in your legend.

        // x axis accessor
        x = function(d) {
          return d.State;
        },
        xScale = 'ordinal',
        // y tick format
        yTickFormat = d3.format(".2s");

        // ReactDom.render(
        // <BarStackZoom
        //   title= {title}
        //   data= {this.state.graphData}
        //   width= {width}
        //   height= {height}
        //   chartSeries = {this.state.chartSeries}
        //   x= {x}
        //   xScale= {xScale}
        //   yTickFormat= {yTickFormat}
        // />, document.getElementById('data_zoom_bar_stack'));

    return (
      <Row>
      <Col xs={12} md={12}>
      <h2>Look back</h2>
      <Panel header={<h1>Selected History</h1>}>
        <Grid fluid>
        <Row>
          <Col xs={12} md={4}>

            <h3 className="section-heading">How far back?</h3>
            <Select
              value={this.state.days} 
              options={dayOptions} 
              matchProp='any'
              onChange={this.selectDay.bind(this)} />

            <h3 className="section-heading">Filter results by:</h3>
            <Select
              value={this.state.filterMode} 
              onChange={this.selectFilterMode.bind(this)}
              matchProp='any'
              options={filterOptions} />

            <h3 className="section-heading">Options</h3>
            <Select multi
              disabled={this.state.filterMode === 'total' ? true : false } 
              onChange={this.selectFilterOptions.bind(this)}
              value={this.state.filterOptions}
              options={this.state.filterMode === 'route' ? this.props.state.myAppHistory.routeNames: this.props.state.myAppHistory.serverNames} />

          </Col>
          <Col xs={12} md={8}>
            <h3>Selected Data</h3>
            <div id='data_zoom_bar_stack'></div>
            
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