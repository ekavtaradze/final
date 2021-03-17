
// Constants
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight * (0.6);
var width = windowWidth;
var height = windowHeight;
const scale = 300;
const margin = {top: 0, right: 0, bottom: 0, left: 0},
    svgWidth = width - margin.left - margin.right,
    svgHeight = height - margin.top - margin.bottom;

const astronautColorDefault = "#FFFFFF";
const astronautColorClicked = "#FFFF00"
const countryColorDefault = "#000000";

const zoomOutLimit = 1;

var mapSvg;

// Map projection transform
const gMapProjection = d3.geoCylindricalStereographic()
    .translate([150, 200])
    .scale(scale);

// Map SVG transform (changes often)
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
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 "+ svgWidth +" "+ svgHeight +"")
        .classed("svg-content-responsive", true)

    const geoPath = d3.geoPath()
        .projection(gMapProjection)


    mapSvg.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
            .attr('id', function(d) {return d.properties.Name})
            .attr('d', function(d){return geoPath(d)})
            .attr('stroke-width', 1)
            .attr('stroke', '#FFFFFF')
            .attr('fill', countryColorDefault);

    // This path drawing algorithm will NOT draw cities twice
    // It will also just not draw some cities, which is bs
    // So doing it this way
    for (let i in astronautCities.features)
    {
        mapSvg.append('path')
            .attr('id', () => {return "A" + astronautCities.features[i].properties.ID})
            .attr('d', () => {return geoPath(astronautCities.features[i]);})
            .attr('stroke-width', 1)
            .attr('stroke', '#FFFF00')
            .attr('class', "astronautCity")
            .attr('fill', astronautColorDefault);
    }

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
        // Scale the offset by the transformed svg size
        var element = document.querySelector('#map');
        var scaleX = svgWidth / element.offsetWidth;
        var scaleY = svgHeight / element.offsetHeight;

        // Invert the svg coordiantes to map coordinates
        let mapCoordinate = gTransform.invert([e.offsetX * scaleX, e.offsetY * scaleY]);

        // Invert the map coordinates to feature space
        let featureCoordinate = gMapProjection.invert(mapCoordinate);

        // erase previous selection
        gCurrentAstronauts = [];

        d3.selectAll(".astronautCity")
            .attr("fill", astronautColorDefault);

        // Hard to change, since it's non-linear, go the current one through trying a few points

        let searchRadius = getRadiusTransform(gTransform.k);

        let currentAstronauts = [];

        // Select all circles within the radius
        for (let i = 0; i < gAstronautCities.features.length; i++)
        {
            if (geoContains(gAstronautCities.features[i].geometry.coordinates, featureCoordinate, searchRadius))
            {
                currentAstronauts.push(gAstronautCities.features[i].properties);

                d3.select("#" + "A" + gAstronautCities.features[i].properties.ID)
                    .attr("fill", astronautColorClicked);
            }
        }

        GetLinks(currentAstronauts);
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

/**
 * Radius transform function, Non-linear
 * @param {} k zoom level
 * @returns the transformed radius size
 */
function getRadiusTransform(k)
{
    // Zoom out max: 3
    // Zoom in max: ~1.4
    // k: 1 -> inf
    return 2.4/(k + 1) + 1.4;
}
