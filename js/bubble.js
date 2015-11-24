/**
 * Created by kohlm on 10/09/2015.
 * Based on http://bl.ocks.org/mbostock/4063269
 */

var diameter = 750,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svgBubble = d3.select("#bubble").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json("json/OGL_counts.json", function(error, root) {
  if (error) throw error;

  var node = svgBubble.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value) + " entries"; });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .style("font-size", function(d) { return (Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24)) / 3.8 + "px"; })
      .style("pointer-events", "none")
      .style("font-family", "Quicksand, sans-serif")
      .text(function(d) { return d.className.substring(0, d.r / 3); });
});


// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.langCodes, value: node.headwordCount});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");

