
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

function main(countries, cities, astronauts)
{
    mapSvg = d3.select("#map")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    createMap(countries, filterCities(cities, astronauts));

}

function filterCities(cities, astronauts)
{
    // Query select the cities the astronauts are from
    let astronautCities = Object.assign([], astronauts);
    astronautCities = astronautCities.map(function(a)
    {
        return a['Birth Place'].toUpperCase().split(",")[0];
    });

    let previousCity = "";
    let filteredCities = {features: []};

    filteredCities.features = cities.features.filter((city) =>
    {
        for (let i = 0; i < astronautCities.length; i++)
        {
            if (astronautCities[i] === city.properties.NAME)
            {
                // if (city.properties.NAME === previousCity)
                // {
                //     console.log("Dupe: " + city.properties.NAME)
                // }
                // else
                // {
                //     previousCity = city.properties.NAME;
                // }

                return true;
            }
        }
    });




    return filteredCities;
}


    /**
     * The function which creates the worldmap from the geo.json file.
     *
     * @param geoData
     */
     function createMap(countries, cities)
     {

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
             .on("click", function(){
                 if(d3.select(this).attr('fill') === colorDefault){
                     console.log("Color is not white!")
                     d3.select(this).attr("fill", colorClicked);
                 }
                 else{
                     console.log("Color is white")
                     d3.select(this).attr("fill", colorDefault);
                 }
             })

        map.selectAll('path')
             .data(cities.features)
             .enter()
             .append('path')
             .attr('d', function(d){return geoPath(d)})
             .attr('stroke-width', 1)
             .attr('stroke', '#FFFF00')
             .attr('class', function(d){return d.properties.name})
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


                 // // Zoom limiting
                 //


             }
     }
