
    // Constants
    const width = 500;
    const height = 300;
    const scale = 200;
    const margin = {top: 10, right: 5, bottom: 15, left: 20},
        svgWidth = width - margin.left - margin.right,
        svgHeight = height - margin.top - margin.bottom;
  
    const countryColorDefault = "#000000";
    const countryColorClicked = "FFFF00";
    
    const astronautColorDefault = "#FFFFFF";
    const astronautColorClicked = "#FFFF00"
   

    const zoomOutLimit = 0.5;

    var mapSvg;

    var gTransform; 

    var gAstronautCities;

    var gCurrentAstronauts = [];

/**
 * The function which creates the worldmap from the geo.json file.
 *
 * @param geoData
*/
function makeWorldMap(countries, astronautCities)
{
    gAstronautCities = astronautCities;

    mapSvg = d3.select("#map")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    const projection = d3.geoCylindricalStereographic()
        .scale(scale)

    const geoPath = d3.geoPath()
        .projection(projection)

    mapSvg.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
            .attr('id', function(d) {return d.properties.Name})
            .attr('d', function(d){return geoPath(d)})
            .attr('stroke-width', 1)
            .attr('stroke', '#FFFFFF')
            .attr('fill', countryColorDefault);

    mapSvg.selectAll('path')
        .data(astronautCities.features)
        .enter()
        .append('path')
            .attr('id', function(d) {return getBDID(d.properties['Birth Date'])})
            .attr('d', function(d) {return geoPath(d)})
            .attr('stroke-width', 1)
            .attr('stroke', '#FFFF00')
            .attr('class', "astronautCity")
            .attr('fill', astronautColorDefault)

        // Zoom on map
        var mapZoom = d3.zoom()
            .on('zoom', zoomed);

        var zoomSettings = d3.zoomIdentity
            .translate(width/3, height/2)
            .scale(zoomOutLimit);

        mapSvg.call(mapZoom)
            .call(mapZoom.transform, zoomSettings)

        function zoomed(e)
            {
                //console.log(e.transform.k);
                if (e.transform.k >= zoomOutLimit)
                {
                    mapSvg.selectAll('path').attr('transform', e.transform);
                    mapSvg.selectAll('circle').attr('transform', e.transform);
                    gTransform = e.transform;
                }
                else
                {
                    e.transform.k = zoomOutLimit;
                }
            }

    // Cluster selection
    mapSvg.on("click", function(e)
    {
        // Invert the svg coordiantes to map coordinates
        let mapCoordinate = gTransform.invert([e.offsetX, e.offsetY]);
        
        // Invert the map coordinates to feature space
        let featureCoordinate = d3.geoCylindricalStereographic()
            .scale(scale).invert(mapCoordinate);

        // erase previous selection
        gCurrentAstronauts = [];

        d3.selectAll(".astronautCity")
            .attr("fill", astronautColorDefault);

        // Needs to be tweaked, idk what to do here
        let searchRadius = (10/(gTransform.k) + 5)/10;

        // Select all circles within the radius
        for (let i = 0; i < gAstronautCities.features.length; i++)
        {
            if (geoContains(gAstronautCities.features[i].geometry.coordinates, featureCoordinate, searchRadius))
            {
                gCurrentAstronauts.push(gAstronautCities.features[i].properties);
                
                d3.select("#" + getBDID(gAstronautCities.features[i].properties['Birth Date']))
                    .attr("fill", astronautColorClicked);
            }
        }
    });
}

// Because d3's expects an exact coordinate and doesn't let me put in a proximity
// So had to make my own version
function geoContains(featureCoordinate, coordinate, radius)
{
    // https://stackoverflow.com/questions/481144/equation-for-testing-if-a-point-is-inside-a-circle
    // pythagorus method
    return ((Math.pow(featureCoordinate[0] - coordinate[0], 2) 
    + Math.pow(featureCoordinate[1] - coordinate[1], 2)) < Math.pow(radius, 2)) 
}

function getBDID(birthDay)
{
    return "BD" + birthDay.split("/").join("");
}

