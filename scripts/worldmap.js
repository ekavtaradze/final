
    // Constants
    const width = 500;
    const height = 300;
    const scale = 200;
    const margin = {top: 10, right: 5, bottom: 15, left: 20},
        svgWidth = width - margin.left - margin.right,
        svgHeight = height - margin.top - margin.bottom;
    const colorClicked = "#000000";
    const colorDefault = "#FFFFFF";

    const zoomOutLimit = 0.5;

    var mapSvg;

/**
 * The function which creates the worldmap from the geo.json file.
 *
 * @param geoData
*/
function makeWorldMap(countries, astronautCities)
{
    mapSvg = d3.select("#map")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    const projection = d3.geoCylindricalStereographic()
        .scale(scale)

    const geoPath = d3.geoPath()
        .projection(projection)

    let map = mapSvg.append("g");

    map.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', function(d){return geoPath(d)})
        .attr('stroke-width', 1)
        .attr('stroke', '#FFFFFF')
        .attr('class', function(d){return d.properties.name})
        .attr('fill', '#000000')
        .on("click", function()
        {
            if(d3.select(this).attr('fill') === colorDefault)
            {
                d3.select(this).attr("fill", colorClicked);
            }
            else
            {
                d3.select(this).attr("fill", colorDefault);
            }
        });

    map.selectAll('path')
        .data(astronautCities.features)
        .enter()
        .append('path')
        .attr('d', function(d){return geoPath(d)})
        .attr('stroke-width', 1)
        .attr('stroke', '#FFFF00')
        .attr('class', function(d){return d.properties.Name})
        .attr('fill', '#FFFFFF');

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
            }
     }
