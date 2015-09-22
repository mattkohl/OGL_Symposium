/**
 * Created by kohlm on 10/09/2015.
 */

    var links = [

        {source: "cheetah", target: "noun", type: "lexical category"},
        {source: "cheetah", target: "cītā", type: "derives from"},
        {source: "cheetah", target: "English", type: "language"},
        {source: "lepogo", target: "noun", type: "lexical category"},
        {source: "lepogo", target: "Northern Sotho", type: "language"},
        {source: "cheetah", target: "sense_e1", type: "has sense"},
        {source: "sense_e1", target: "A large slender spotted cat found in Africa and parts of Asia", type: "definition"},
        {source: "sense_e1", target: "sense_n1", type: "translation"},
        {source: "lepogo", target: "sense_n1", type: "has sense"}

    ];

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });

    var width = 1200,
            height = 1000;

    var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(300)
            .charge(-2000)
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
            .attr("r", 50)
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
                .attr("r", 60);
    }

    function mouseout() {
        d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 50);
    }