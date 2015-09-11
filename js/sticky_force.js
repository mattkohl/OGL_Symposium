/**
 * Created by MBK on 11/09/15.
 */


var fwidth = 960,
    fheight = 500;

var fforce = d3.layout.force()
    .size([fwidth, fheight])
    .charge(-400)
    .linkDistance(40)
    .on("tick", tick);

var fdrag = fforce.drag()
    .on("dragstart", fdragstart);

var svgForce = d3.select("#stickyforce").append("svg")
    .attr("width", fwidth)
    .attr("height", fheight);

var flink = svgForce.selectAll(".link"),
    fnode = svgForce.selectAll(".node");

d3.json("json/sticky_force.json", function(ferror, fgraph) {
  if (ferror) throw ferror;

  fforce
      .nodes(fgraph.nodes)
      .links(fgraph.links)
      .start();

  flink = flink.data(fgraph.links)
    .enter().append("line")
      .attr("class", "link");

  var gnodes = fnode.data(fgraph.nodes)
     .enter()
     .append('g')
     .classed('gnode', true);

  fnode = gnodes.append("circle")
      .attr("class", "node")
      .attr("r", 15)
      .on("dblclick", fdblclick)
      .call(fdrag);

});



function tick() {
  flink.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  fnode.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

function fdblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
}

function fdragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}
