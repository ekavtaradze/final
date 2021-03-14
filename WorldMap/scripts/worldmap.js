
    // Constants
    const width = 2000;
    const height = 600;
    const margin = {top: 10, right: 5, bottom: 15, left: 20},
        svgWidth = width - margin.left - margin.right,
        svgHeight = height - margin.top - margin.bottom;

    //Create an SVG
    var svg = d3.select("body")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("id", 'map')
        .attr("class", "svgMap")


    //Import the geojson for the world
    Promise.all([
        d3.json('geojson/worldmap.geo.json')
    ]).then( ([countries]) => {
        createMap(countries);
    })

    /**
     * The function which creates the worldmap from the geo.json file.
     *
     * @param countries
     */
    function createMap(countries){

        const projection = d3.geoCylindricalStereographic()
            .scale(200);

        const geoPath = d3.geoPath()
            .projection(projection)


        svg.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('d', function(d){return geoPath(d)})
            .attr('stroke-width', 1)
            .attr('stroke', '#252525')
            .attr('class', function(d){return d.properties.name})
            .attr('fill', '#FFFFFF')
            .attr('transform', 'translate(' + svgWidth/4.5 + ',' + 100 + ')');

            //Zoom on map
            var mapZoom = d3.zoom()
              .on('zoom', zoomed);

            var zoomSettings = d3.zoomIdentity
              .translate(250, 250)
              .scale(120);

            d3.select('#map')
              .call(mapZoom)
              .call(mapZoom.transform, zoomSettings);

            function zoomed(e) {
              projection.translate([e.transform.x, e.transform.y])
                .scale(e.transform.k);
              d3.select('#map').selectAll('path')
                .attr('d', geoPath);
            }
    }
