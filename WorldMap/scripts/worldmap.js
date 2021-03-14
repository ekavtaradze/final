
    // Constants
    const width = 2000;
    const height = 600;
    const scale = 500;
    const margin = {top: 10, right: 5, bottom: 15, left: 20},
        svgWidth = width - margin.left - margin.right,
        svgHeight = height - margin.top - margin.bottom;

    const zoomOutLimit = 0.4;

    //Create an SVG
    var svg = d3.select("body")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("id", 'map')
        .attr("class", "svgMap")
        .attr("tabindex", 1)


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
    function createMap(countries)
    {

        const projection = d3.geoCylindricalStereographic()
            .scale(scale)

        const geoPath = d3.geoPath()
            .projection(projection)

        let map = svg.append("g");

        map.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('d', function(d){return geoPath(d)})
            .attr('stroke-width', 1)
            .attr('stroke', '#252525')
            .attr('class', function(d){return d.properties.name})
            .attr('fill', '#FFFFFF')

            // Zoom on map
            var mapZoom = d3.zoom()
              .on('zoom', zoomed);

            var zoomSettings = d3.zoomIdentity
              .translate(width/3, height/2)
              .scale(zoomOutLimit);

            map.call(mapZoom)
              .call(mapZoom.transform, zoomSettings)


            function zoomed(e)
            {
                //console.log(e.transform.k);
                if (e.transform.k >= zoomOutLimit)
                {
                    map.selectAll('path').attr('transform', e.transform);
                }
                else 
                {
                  e.transform.k = zoomOutLimit;
                }
                

                // // Zoom limiting
                // 

              
            }
    }
