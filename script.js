/*--------------------------------------------------------------------
GGR472 WEEK 8: JavaScript for Web Maps
Adding elements to the map (map controls and basic legend)
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
INITIALIZE MAP
--------------------------------------------------------------------*/
mapboxgl.accessToken = ''; //***ADD YOUR ACCESS TOKEN HERE***

const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/standard',
    config: {
        basemap: {
            theme: "monochrome"
        }
    },
    center: [-95, 63],
    zoom: 3,
    minZoom: 3
});


/*--------------------------------------------------------------------
ADDING MAPBOX CONTROLS AS ELEMENTS ON MAP
--------------------------------------------------------------------*/
// Add search control to map overlay
// Requires plugin as source in HTML
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "ca" // Limit to Canada only
    })
);

// Add zoom and rotation controls to the top left of the map
map.addControl(new mapboxgl.NavigationControl());

// Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

/*--------------------------------------------------------------------
mapbox addControl method can also take position parameter
(e.g., 'top-left') to move from default top right position

To place geocoder elsewhere on page (including outside of the map),
instead of using addControl method, create HTML div tag for geocoder
and use css to position
--------------------------------------------------------------------*/

// Create geocoder as a variable (and remove previous geocoder)
// const geocoder = new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken,
//     mapboxgl: mapboxgl,
//     countries: "ca" 
// });

// Append geocoder variable to goeocoder HTML div to position on page
// document.getElementById('my-geocoder').appendChild(geocoder.onAdd(map));



// /*--------------------------------------------------------------------
// ADD DATA AS CHOROPLETH MAP ON MAP LOAD
// Use get expression to categorise data based on population values
// Same colours and threshold values are used in hardcoded legend
// --------------------------------------------------------------------*/
// Add data source and draw initial visiualization of layer
// map.on('load', () => {
//     map.addSource('provterr-data', {
//         'type': 'geojson',
//         'data': 'https://raw.githubusercontent.com/smith-lg/ggr472-wk8-demo1/refs/heads/main/data/can-provterr.geojson'
//     });

//     map.addLayer({
//         'id': 'provterr-fill',
//         'type': 'fill',
//         'source': 'provterr-data',
//         'paint': {
//             'fill-color': [
//                 'step', // STEP expression produces stepped results based on value pairs
//                 ['get', 'POP2021'], // GET expression retrieves property value from 'capacity' data field
//                 '#fd8d3c', // Colour assigned to any values < first step
//                 100000, '#fc4e2a', // Colours assigned to values >= each step
//                 500000, '#e31a1c',
//                 1000000, '#bd0026',
//                 5000000, '#800026'
//             ],
//             'fill-opacity': 0.5,
//             'fill-outline-color': 'white'
//         }
//     });
// });
