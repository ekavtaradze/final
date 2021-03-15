function sankey(){
  console.log("here");
  // set the dimensions and marginSs of the graph
  var marginS = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    widthS = 900 - marginS.left - marginS.right,
    heightS = 300 - marginS.top - marginS.bottom;

  // format variables
  var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function(d) {
      return formatNumber(d);
    };
  var  color = d3.scaleOrdinal(d3.schemeCategory10);

  // append the svg object to the body of the page
  var svgSankey = d3.select("#my_dataviz").append("svg")
    .attr("width", widthS + marginS.left + marginS.right)
    .attr("height", heightS + marginS.top + marginS.bottom)
    .append("g")
    .attr("transform",
      "translate(" + marginS.left + "," + marginS.top + ")");

  // Set the sankey diagram properties
  var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([widthS, heightS]);

  var path = sankey.links();

  // load the data
  d3.csv("sankey.csv").then(function(data) {

    //set up graph in same style as original example but empty
    sankeydata = {
      "nodes": [],
      "links": []
    };

    data.forEach(function(d) {
      sankeydata.nodes.push({
        "name": d.source
      });
      sankeydata.nodes.push({
        "name": d.target
      });
      sankeydata.links.push({
        "source": d.source,
        "target": d.target,
        "value": +d.value
      });
    });

    // return only the distinct / unique nodes
    sankeydata.nodes = Array.from(
      d3.group(sankeydata.nodes, d => d.name),
      ([value]) => (value)
    );

    // loop through each link replacing the text with its index from node
    sankeydata.links.forEach(function(d, i) {
      sankeydata.links[i].source = sankeydata.nodes
        .indexOf(sankeydata.links[i].source);
      sankeydata.links[i].target = sankeydata.nodes
        .indexOf(sankeydata.links[i].target);
    });

    // now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    sankeydata.nodes.forEach(function(d, i) {
      sankeydata.nodes[i] = {
        "name": d
      };
    });

    graph = sankey(sankeydata);

    // add in the links
    var link = svgSankey.append("g").selectAll(".link")
      .data(graph.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) {
        return d.width;
      });

    // add the link titles
    link.append("title")
      .text(function(d) {
        return d.source.name + " → " +
          d.target.name + "\n" + format(d.value);
      });

    // add in the nodes
    var node = svgSankey.append("g").selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "node");

    // add the rectangles for the nodes
    node.append("rect")
      .attr("x", function(d) {
        return d.x0;
      })
      .attr("y", function(d) {
        return d.y0;
      })
      .attr("height", function(d) {
        return d.y1 - d.y0;
      })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) {
        return d.color = color(d.name.replace(/ .*/, ""));
      })
      .style("stroke", function(d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function(d) {
        return d.name + "\n" + format(d.value);
      });

    // add in the title for the nodes
    node.append("text")
      .attr("x", function(d) {
        return d.x0 - 6;
      })
      .attr("y", function(d) {
        return (d.y1 + d.y0) / 2;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) {
        return d.name;
      })
      .filter(function(d) {
        return d.x0 < widthS / 2;
      })
      .attr("x", function(d) {
        return d.x1 + 6;
      })
      .attr("text-anchor", "start");
  });
}
