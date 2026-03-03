
// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY29ldGhhbiIsImEiOiJjbW04Mm9vNTAwem5hMnFwbXA3bm9sYzg1In0.FUDLFtuUAAp3eF1BSszV6g'; //***ADD YOUR PUBLIC ACCESS TOKEN***

// Initialize map
const map = new mapboxgl.Map({
    container: 'my-map', //container id in HTML
    style: 'mapbox://styles/mapbox/dark-v11',  //stylesheet location
    center: [-79.39, 43.65],  // starting point, longitude/latitude 43.652652, -79.393014
    zoom: 12 // starting zoom level
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(), 'top-right');


map.on('load', () => {

    // Add datasource from GeoJSON
    map.addSource('toronto-pt', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/coethan04/Lab3GGR472/refs/heads/main/map-4.geojson'
        //'https://smith-lg.github.io/ggr472-wk6-demo/data/torontomusicvenues.geojson'
    });

    // Draw GeoJSON points
    map.addLayer({
        'id': 'toronto-pt-pnts',
        'type': 'circle',
        'source': 'toronto-pt',
        'paint': {
            'circle-radius': [
                'interpolate', //INTERPOLATE expression produces continuous results by interplating between value pairs
                ['linear'], //linear interpolation between stops but could be exponential ['exponential', base] where base controls rate at which output increases
                ['zoom'], //zoom expression changes appearance with zoom level
                10, 5, // when zoom is 10 (or less), radius will be 5px
                12, ['/', ['get', 'capacity'], 20] // when zoom is 12 (or greater), radius will be capacity/20
            ],
            'circle-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'capacity'], // GET expression retrieves property value from 'capacity' data field
                '#800026', // Colour assigned to any values < first step
                150, '#bd0026', // Colours assigned to values >= each step
                500, '#e31a1c',
                1000, '#fc4e2a',
                2500, '#fd8d3c'
            ]
        },
    });

    // Draw GeoJSON labels using 'name' property
    map.addLayer({
        'id': 'toronto-pt-labels',
        'type': 'symbol',
        'source': 'toronto-pt',
        'layout': {
            'text-field': ['get', 'name'],
            'text-variable-anchor': ['bottom'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto'
        },
        'paint': {
            'text-color': 'blue'
        }
    });

});


/*--------------------------------------------------------------------
EXAMPLE FILTERS
Data expressions: get, has
Conditional expressions: ==, >=, (etc.), any, all
--------------------------------------------------------------------*/
// //Filter data shown in layer
// 'filter': ['>=', ['get', 'capacity'], 1000]  //Only shows points with capacity >= 1000
// 'filter': ['==', ['get', 'name'], 'Horseshoe Tavern'] 
// 'filter': ['has', 'opentimes']
// 'filter': ['!', ['has', '...']]

// 'filter': ['any',    //ANY expression returns true if any inputs are met (OR)
//     ['==', ['get', 'name'], 'Horseshoe Tavern'],
//     ['==', ['get', 'name'], 'The Axis Club']] //returns features with name = "Horseshoe Tavern" or "The Axis Club"

// 'filter': ['all',    //ALL expression returns true if all inputs are met (AND)
//     ['==', ['get', 'name'], 'Horseshoe Tavern'],
//     ['==', ['get', 'name'], 'The Axis Club']] //returns features with name = "Horseshoe Tavern" or "The Axis Club"



/*--------------------------------------------------------------------
EXAMPLE APPLICATION OF CATEGORICAL COLOUR SCHEME
Data expressions: get
Ramp/scale expression: step
--------------------------------------------------------------------*/
//Changing colour of marker based on categories
//Uses step and get expressions
// [
//     'step', // STEP expression produces stepped results based on value pairs
//     ['get', 'capacity'], // GET expression retrieves property value from 'capacity' data field
//     '#800026', // Colour assigned to any values < first step
//     150, '#bd0026', // Colours assigned to values >= each step
//     500, '#e31a1c',
//     1000, '#fc4e2a',
//     2500, '#fd8d3c'
// ]



/*--------------------------------------------------------------------
EXAMPLE UPDATE OF MARKER SIZE BASED ON DATA VALUE AND ZOOM
Data expressions: get
Ramp/scale expression: interpolate (type: linear)
Camera expression: zoom
Maths expressions: /, *
--------------------------------------------------------------------*/
//Set marker size to (capacity/20) using Maths expressions
//['*', ['get', 'capacity'], 0.05]
//['/', ['get', 'capacity'], 20]

//Change marker size on zoom
//Uses interpolate operator to define linear relationship between zoom level and circle size
// [
//     'interpolate', //INTERPOLATE expression produces continuous results by interplating between value pairs
//     ['linear'], //linear interpolation between stops but could be exponential ['exponential', base] where base controls rate at which output increases
//     ['zoom'], //ZOOM expression changes appearance with zoom level
//     8, 1, // when zoom level is 8 or less, circle radius will be 1px
//     12, 10 // when zoom level is 12 or greater, circle radius will be 10px
// ]

// [
//     'interpolate', //INTERPOLATE expression produces continuous results by interplating between value pairs
//     ['linear'], //linear interpolation between stops but could be exponential ['exponential', base] where base controls rate at which output increases
//     ['zoom'], //zoom expression changes appearance with zoom level
//     10, 5, // when zoom is 10 (or less), radius will be 5px
//     12, ['/',['get', 'capacity'],20] // when zoom is 12 (or greater), radius will be capacity/20
// ]

document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-95, 63],
        zoom: 3,
        essential: true
    });
});

let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});

document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'toronto-pt-pnts',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});

/*--------------------------------------------------------------------
ADD POP-UP ON CLICK EVENT
--------------------------------------------------------------------*/
map.on('mouseenter', 'toronto-pt-pnts', () => {
    map.getCanvas().style.cursor = 'pointer'; // Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'toronto-pt-pnts', () => {
    map.getCanvas().style.cursor = ''; // Switch cursor back when mouse leaves provterr-fill layer
});

map.on('click', 'toronto-pt-pnts', (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("Point Location Found!") // Use click event properties to write text for popup
        .addTo(map); // Show popup on map
})
