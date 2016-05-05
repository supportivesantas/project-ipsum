import { React, Component } from 'react';
import { Link } from 'react-router';
import request from '../util/restHelpers.js';  // url, data, callback

export default class BarGraph extends Component {
  constructor(props) {
    super(props);
    this.displayName = 'd3BarGraph';
  }

  componentWillMount() {
    this.props.
  }

  render() {
    var data = [4, 8, 15, 16, 23, 42];

    var width = 420,
      barHeight = 20;

    var x = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([0, width]);

    var chart = d3.select(".barGraph")
      .attr("width", width)
      .attr("height", barHeight * data.length);

    var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
      .attr("width", x)
      .attr("height", barHeight - 1);

    bar.append("text")
      .attr("x", function(d) { return x(d) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

    return (
        <div className="barGraph"></div>   
      );
  }
}

// ensure the data is present before trying to render
BarGraph.propTypes = { data: React.PropTypes.object.isRequired };

