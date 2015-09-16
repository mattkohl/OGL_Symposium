/**
 * Created by kohlm on 10/09/2015.
 */

    var links = [

        {source: "graph (en)", target: "noun", type: "lexical category"},
        {source: "graph (en)", target: "sense_a1b2c3", type: "has sense"},
        {source: "sense_a1b2c3", target: "kerafo (nso)", type: "has direct translation"},
        {source: "sense_a1b2c3", target: "Use its graph-drawing function", type: "has example"},
        {source: "sense_a1b2c3", target: "igrafu (zu)", type: "has direct translation"},
        {source: "sense_a1b2c3", target: "A diagram showing the relation between variable quantities. (en)", type: "has definition"},
        {source: "graph (en)", target: "/?raf/", type: "has phonetics"},
        {source: "graph (en)", target: "graphic formula", type: "derives from"},
        {source: "graph (en)", target: "behalf (en)", type: "rhymes with"},
        {source: "graph (en)", target: "half (en)", type: "rhymes with"},
        {source: "graph (en)", target: "calf (en)", type: "rhymes with"},
        {source: "sense_a1b2c3", target: "sense_a2b3c4", type: "has synonym"},


        {source: "chart (en)", target: "noun", type: "lexical category"},
        {source: "chart (en)", target: "sense_a2b3c4", type: "has sense"}

//        {source: "", target: "", type: ""},
//        {source: "", target: "", type: ""},
//        {source: "", target: "", type: ""},
//        {source: "", target: "", type: ""},
//        {source: "", target: "", type: ""},
//        {source: "", target: "", type: ""},
//        {source: "", target: "", type: ""},
//        {source: "", target: "", type: ""},
//        {source: "", target: "", type: ""}
    ];

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });

    var width = 1000,
            height = 800;

    var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(100)
            .charge(-1000)
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
            .attr("r", 20);

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