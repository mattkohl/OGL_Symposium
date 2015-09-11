/**
 * Created by kohlm on 11/09/2015.
 */

    var width = 800,
        height = 400;

    var force = d3.layout.force()
            .size([width, height])
            .linkDistance(100)
            .charge(-1000)
            .on("tick", tick);

    var svgEntry = d3.select("#entry").append("svg")
            .attr("width", width)
            .attr("height", height);

    var link = svgEntry.selectAll(".link")
            .enter().append("g")
            .attr("class", "gLink")
            .append("line")
            .attr("class", "link");

    var node = svgEntry.selectAll(".node");
            //.enter().append("g")
            //.attr("class", "node")
            //.on("mouseover", mouseover)
            //.on("mouseout", mouseout)
            //.call(force.drag);

d3.json("json/entry.json", function(error, graph) {
    if (error) throw error;

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    node.append("circle")
        .attr("r", 20);

    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        });

});
    // Append text to Link edges
    var linkText = svgEntry.selectAll(".gLink")
        .data(force.links())
        .append("text")
        .attr("x", function (d) {
            if (d.target.x > d.source.x) {
                return (d.source.x + (d.target.x - d.source.x) / 2);
            }
            else {
                return (d.target.x + (d.source.x - d.target.x) / 2);
            }
        })
        .attr("y", function (d) {
            if (d.target.y > d.source.y) {
                return (d.source.y + (d.target.y - d.source.y) / 2);
            }
            else {
                return (d.target.y + (d.source.y - d.target.y) / 2);
            }
        })
        .attr("fill", "Black")
        .style("font", "normal 9px Arial")
        .attr("dy", ".35em")
        .text(function (d) {
            return d.type;
        });

    function tick() {
        link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

        node
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

        linkText
                .attr("x", function (d) {
                    if (d.target.x > d.source.x) {
                        return (d.source.x + (d.target.x - d.source.x) / 2);
                    }
                    else {
                        return (d.target.x + (d.source.x - d.target.x) / 2);
                    }
                })
                .attr("y", function (d) {
                    if (d.target.y > d.source.y) {
                        return (d.source.y + (d.target.y - d.source.y) / 2);
                    }
                    else {
                        return (d.target.y + (d.source.y - d.target.y) / 2);
                    }
                });
    }

    function mouseover() {
        d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 30);
    }

    function mouseout() {
        d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 20);
    }