

    const circleSize=100;

    function classes(root) {
        var classes = [];
        for (var key in root) {
            classes.push({packageName: key, className: key, value: root[key]*circleSize});
        }
        return {children: classes};
    }





    var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

    var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);



    var generateD3View = function(root) {

        var svg = d3.select("#items").append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

        var node = svg.selectAll(".node")
            .data(bubble.nodes(classes(root))
                .filter(function (d) {
                    return !d.children;
                }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("title")
            .text(function (d) {
                return d.className + ": " + format(d.value);
            });

        node.append("circle")
            .attr("r", function (d) {
                return d.r;
            })
            .style("fill", function (d) {
                return color(d.packageName);
            });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function (d) {
                return d.className.substring(0, d.r / 3);
            });
    }

    d3.select(self.frameElement).style("height", diameter + "px");