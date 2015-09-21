/**
 * Created by kohlm on 10/09/2015.
 * based on http://bl.ocks.org/mbostock/950642
 **/

var lfwidth = 960,
    lfheight = 500

var lfsvg = d3.select("#labeledForce").append("svg")
    .attr("width", lfwidth)
    .attr("height", lfheight);

var lfforce = d3.layout.force()
    .gravity(.05)
    .distance(300)
    .charge(-100)
    .size([lfwidth, lfheight]);

d3.json("json/labeled_force.json", function(lferror, lfjson) {
  if (lferror) throw lferror;

  lfforce
      .nodes(lfjson.nodes)
      .links(lfjson.links)
      .start();

  var lflink = lfsvg.selectAll(".link")
      .data(lfjson.links)
    .enter().append("line")
      .attr("class", "link");

  var lfnode = lfsvg.selectAll(".node")
      .data(lfjson.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(lfforce.drag);

  lfnode.append("image")
      .attr("xlink:href", "images/db.png")
      .attr("x", -15)
      .attr("y", -15)
      .attr("width", 25)
      .attr("height", 25);

  lfnode.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  lfforce.on("tick", function() {
    lflink.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    lfnode.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});