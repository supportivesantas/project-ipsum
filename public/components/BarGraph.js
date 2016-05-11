import d3 from 'd3'; 
import d3tip from 'd3-tip';

module.exports = function(divId, data) {

  // clear out the old graph
  var outerDiv = document.getElementById(divId);
  outerDiv.innerHTML  = '<svg class="barGraph"></svg>';

  var chart = d3.select('#' + divId).select('svg')
  var height = null; 

  /* Taken from: https://bost.ocks.org/mike/bar/2/ */
  var width = outerDiv.clientWidth,
    barHeight = 25;

  height = barHeight * data.length;
  document.getElementById(divId).style.height = height + 'px';

  var x = d3.scale.linear()
  .range([0, width]);

  var tip = d3tip(d3)
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Hits:</strong> <span style='color:red'>" + Number(d.value).toLocaleString() + "</span>";
    })

  chart.call(tip);

  x.domain([0, d3.max(data, function(d) { return d.value; })]);

  chart.attr("width", width);

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

  bar.on('mouseover', tip.show)
     .on('mouseout', tip.hide)

}
