exports.render = function(divId, data) {

  var height = null; 
  var divIdString = '#' + divId;

  /* Taken from: https://bost.ocks.org/mike/bar/2/ */
  var width = document.getElementById(divId).parentNode.clientWidth,
    barHeight = 25;

  height = barHeight * data.length;
  document.getElementById(divId).style.height = height + 'px';

  var x = d3.scale.linear()
  .range([0, width]);

  x.domain([0, d3.max(data, function(d) { return d.value; })]);

  var chart = d3.select(divIdString)
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

exports.update = function(divId, data) {
  d3.select(divIdString).remove();
  exports.render(divId, data);
}