/**
 * Created by kohlm on 10/09/2015.
 * based on http://bl.ocks.org/mbostock/4600693
 **/

var owidth = 960,
    oheight = 500;

var ocolor = d3.scale.category20();

var oforce = d3.layout.force()
    .linkDistance(10)
    .linkStrength(2)
    .size([owidth, oheight]);

var osvg = d3.select("#onto").append("svg")
    .attr("width", owidth)
    .attr("height", oheight);

d3.json("json/onto.json", function(oerror, ograph) {
  if (oerror) throw oerror;

  var onodes = ograph.nodes.slice(),
      olinks = [],
      obilinks = [];

  ograph.links.forEach(function(olink) {
    var s = onodes[olink.source],
        t = onodes[olink.target],
        i = {}; // intermediate node
    onodes.push(i);
    olinks.push({source: s, target: i}, {source: i, target: t});
    obilinks.push([s, i, t]);
  });

  oforce
      .nodes(onodes)
      .links(olinks)
      .start();

  var olink = osvg.selectAll(".link")
      .data(obilinks)
    .enter().append("path")
      .attr("class", "link");

  var onode = osvg.selectAll(".node")
      .data(ograph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 7)
      .style("fill", function(d) { return ocolor(d.group); })
      .call(oforce.drag);

  onode.append("title")
      .text(function(d) { return d.name; });

  oforce.on("tick", function() {
    olink.attr("d", function(d) {
      return "M" + d[0].x + "," + d[0].y
          + "S" + d[1].x + "," + d[1].y
          + " " + d[2].x + "," + d[2].y;
    });
    onode.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
});