import { connect } from 'react-redux';
import React from 'react';

class BarGraph extends React.Component {
  constructor(props) {
    super(props);
    /* this is currently necessary because d3 is directly 
    manipulating the dom, and react's virtual dom is not updated acordingly.
    we need to manually let react know the height of our graph. cannot do this before
    mount because we need to grab the parent container width before we can start
    drawing d3 elements */
    this.state = {height: 0};
  }

  componentDidMount() {
    /* Taken from: https://bost.ocks.org/mike/bar/2/ */
    var width = document.querySelector(".barGraph").clientWidth,
      barHeight = 20;

    var data = this.props.state.appServerTotals;

    /* Manaully set the height of the svg element to prevent spillover,
    since React doesn't know d3 is appending the bars to the svg element */
    this.setState({height: barHeight * data.length })

    var x = d3.scale.linear()
    .range([0, width]);

    x.domain([0, d3.max(data, function(d) { return d.value; })]);

    var chart = d3.select(".barGraph")
    .attr("width", width);

    var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", barHeight - 1);

    bar.append("text")
      .attr("x", function(d) { return x(d.value) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.label; }); 
  }

  render() {
    return (
        <svg style={{height: this.state.height}} className="barGraph"></svg>
      );
  }
}

BarGraph = connect(state => ({ state: state }))(BarGraph);
export default BarGraph;
