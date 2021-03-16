function makeSankey(data) {
  console.log("Sankey Start");

  var windowWidth = 1500; //window.innerWidth * (0.9);
  var windowHeight = 500; //window.innerHeight * (0.7);
  var marginS = {
      top: 10,
      right: 250,
      bottom: 10,
      left: 175
    },
    widthS = windowWidth - marginS.left - marginS.right,
    heightS = windowHeight - marginS.top - marginS.bottom;

  var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function(d) {
      return formatNumber(d);
    };


  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // append the svg object to the body of the page
  var svgSankey = d3.select("#my_dataviz").append("svg")
    .attr("width", widthS + marginS.left + marginS.right)
    .attr("height", heightS + marginS.top + marginS.bottom)
    .append("g")
    .attr("transform",
      "translate(" + marginS.left + "," + marginS.top + ")");

  var defs = svgSankey.append("defs");
  defs.append("pattern")
    .attr("id", "bg")
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 860)
    .attr('height', 400)
    .append("svg:image")
    .attr("xlink:href", "img/space.jpg")
    .attr("width", 860)
    .attr("height", 400)
  // .attr("x", 0)
  // .attr("y", 0)
  ;

  // Set the sankey diagram properties
  var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([widthS, heightS])
    .nodeAlign(d3.sankeyJustify);
  //.align('justify');
  //  .align('justify');
  var path = sankey.links();
  var graph;
  var links = svgSankey.append("g");
  var nodes = svgSankey.append("g");
  processCSV(data);
  // load the data
  //  d3.csv("sankey.csv").then(function(data) {
  function processCSV(data) {
    //console.log(data);
    sankeydata = {
      "nodes": [],
      "links": []
    };

    data.forEach(function(d) {
      //  console.log(d);
      sankeydata.nodes.push({
        "name": d.source
      });
      sankeydata.nodes.push({
        "name": d.target
      });
      sankeydata.links.push({
        "source": d.source,
        "target": d.target,
        "value": +d.value,
        "color": d.color
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
    //console.log(sankeydata);
    graph = sankey(sankeydata);
    console.log(graph);
    build();
  }

  //sankey.nodeAlign(d3.sankeyLeft)
  //});
  function build() {

    const color = d3.scaleOrdinal()
      .domain([
        'Male', 'Female', 'Bachelors',
        'Coast Guard', 'Air Force', 'Army',
        'Graduate', 'Marine Corps', 'Navy',
        'Space Walk', 'Active', 'Deceased',
        'Management', 'Space Flight', 'Retired'
      ])
      .range([
        '#90eb9d', '#f9d057', '#cc4040',
        '#B86125', '#003087', '#4b5320',
        '#f29e2e', '#a77C29', '#000048',
        '#00b0ff', 'green', 'red',
        '#f2952e', '#FF4F00', 'grey'
      ]);

    var link = links.selectAll(".link")
      .data(graph.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) {
        return d.width + 5;
      });


    // add the link titles
    link.append("title")
      .text(function(d) {
        return d.source.name + " → " +
          d.target.name + "\n" + format(d.value);
      });

    // add in the nodes
    var node = nodes.selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(
        d3
        .drag()
        .subject(function(d) {
          return d;
        })
        .on("start", function() {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove)
      );
    // .call(d3.drag())
    //   .on("drag", dragmove);

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
        // console.log("fill");
        // console.log(d.name);
        // console.log(color(d.name));
        return d.color = color(d.name);
      })
      //.attr("fill", "url(#bg)")
      .style("stroke", function(d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function(d) {
        return d.name; //+ "\n" + format(d.value);
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
      .attr("font-weight", 700)
      .filter(function(d) {
        return d.x0 < widthS / 2;
      })
      .attr("x", function(d) {
        return d.x1 + 6;
      })
      .attr("text-anchor", "start");


    // node.append("rect")
    //   .attr("x", function(d) {
    //     return d.x0 + 6;
    //   })
    //   .attr("y", function(d) {
    //     return (d.y1 + d.y0) / 2;
    //   }).attr("height", function(d) {
    //           return 5;
    //         })
    //         .attr("width", 10)
    //         .style("fill", "grey");
    //https://bl.ocks.org/micahstubbs/3c0cb0c0de021e0d9653032784c035e9
    // add gradient to links
    link.style('stroke', (d, i) => {
      //console.log('d from gradient stroke func', d);
      //console.log(d);
      //console.log(i);
      // make unique gradient ids
      const gradientID = `gradient${i}`;

      const startColor = d.source.color;
      const stopColor = d.target.color;

      //console.log(gradientID);
       // console.log('startColor', startColor);
       // console.log('stopColor', stopColor);

      const linearGradient = defs.append('linearGradient')
        .attr('id', gradientID);

      linearGradient.selectAll('stop')
        .data([{
            offset: '10%',
            color: startColor
          },
          {
            offset: '90%',
            color: stopColor
          }
        ])
        .enter().append('stop')
        .attr('offset', d => {
          // console.log('d.offset', d.offset);
          return d.offset;
        })
        .attr('stop-color', d => {
          // console.log('d.color', d.color);
          return d.color;
        });

      return `url(#${gradientID})`;
    });

    //https://gist.github.com/mobidots/f86a31ce14a3227affd1c1287794d1a6
    // the function for moving the nodes
    function dragmove(d) {
      d3.select(this)
        .select("rect")
        .attr("x", function(n) {
          //  console.log(n);
          n.x0 = Math.max(0, Math.min(n.x0 + d.dx, widthS - (n.x1 - n.x0)));
          n.x1 = n.x0 + sankey.nodeWidth();

          return n.x0;
        })
        .attr("y", function(n) {
          //  console.log(n);
          n.y0 = Math.max(0, Math.min(n.y0 + d.dy, heightS - (n.y1 - n.y0)));
          n.y1 = n.y0 + (n.x0 - n.x1);
          return n.y0;
        });


      function value_limit(val, min, max) {
        return val < min ? min : (val > max ? max : val);
      };

      d3.select(this)
      .select("text")
      .attr("x", function(n) {
        return n.x0 - 6;
      })
      .attr("y", function(n) {
      //   console.log("y");
      //   console.log(n.y0);
      //   console.log(((n.y1 + n.y0) / 2));
      // console.log(n.y0 - (Math.abs(n.y0-n.y1)/2));
      // console.log(n.y1);
        return n.y0;//value_limit(((n.y1 + n.y0) / 2), n.y1, n.y0);
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(n) {
        return n.name;
      })
      .attr("font-weight", 700)
      .filter(function(n) {
        return n.x0 < widthS / 2;
      })
      .attr("x", function(n) {
        return n.x1 + 6;
      })
      .attr("text-anchor", "start");
      // d3.select(this).select("text")
      //   .attr("transform", function(n) {
      //     return "translate(" + (0) + "," + ((n.y1 + n.y0) / 2) + ")";
      //   });
      sankey.update(graph);
      link.attr("d", d3.sankeyLinkHorizontal());
    }

  }
  // // Radio button change
  //   d3.selectAll('.sankey-align').on('change', function() {
  //     console.log(this.value);
  //     sankey = d3.sankey()
  //       .nodeWidth(36)
  //       .nodePadding(40)
  //       .size([widthS, heightS])
  //       .nodeAlign(eval(this.value));
  //       path = sankey.links();
  //   //  sankey.nodeAlign();
  //     //sankey.update(graph);
  //   //  link.attr("d", d3.sankeyLinkHorizontal());
  //   build();
  //   });

}
