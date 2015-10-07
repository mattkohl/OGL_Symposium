/**
 * Created by kohlm on 10/09/2015.
 */

    var links = [

        {source: "isidlo sasemini", target: "noun", type: "part of speech"},
        {source: "lunch", target: "noun", type: "part of speech"},
        {source: "isidlo sasemini", target: "isiZulu", type: "language"},
        {source: "lunch", target: "English", type: "language"},
        {source: "letena", target: "noun", type: "part of speech"},
        {source: "letena", target: "Northern Sotho", type: "language"},
        {source: "lunch", target: "sense_lunch", type:"sense"},
        {source: "letena", target: "sense_letena", type: "sense"},
        {source: "isidlo sasemini", target: "sense_isidlo sasemini", type: "sense"},
        {source: "sense_letena", target: "sense_lunch", type: "translation"},
        {source: "sense_lunch", target: "sense_isidlo sasemini", type: "translation"},
        {source: "sense_lunch", target: "sense_isidlo sasemini", type: "translation"},
        {source: "sense_lunch", target: "A meal eaten in the middle of the day...", type: "definition"}

    ];

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });

    var width = 1400,
            height = 900;

    var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(200)
            .charge(-3500)
            .on("tick", tick)
            .start();

    var svgEntry = d3.select("#entry").append("svg")
            .attr("width", width)
            .attr("height", height);

    var link = svgEntry.selectAll(".link")
            .data(force.links())
            .enter().append("g")
            .attr("class", "gLink")
            .append("line")
            .attr("class", "link");

    var node = svgEntry.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .call(force.drag);

    node.append("circle")
            .attr("r", 20)
            .style("fill", function(d) { return color(d.name); });

    node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.name;
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