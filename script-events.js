// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY29ldGhhbiIsImEiOiJjbW04Mm9vNTAwem5hMnFwbXA3bm9sYzg1In0.FUDLFtuUAAp3eF1BSszV6g'; //*** ADD PUBLIC ACCESS TOKEN HERE ***

// Initialize map
const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/coethan/cmm9gnlfw001401s1ddxv60r3',
    center: [-105, 58],
    zoom: 3,
    maxbounds: [
        [-180, 30],
        [-25,84]
    ],
    minZoom: 3
});

// Add search control to map overlay
// Requires plugin as source in HTML body
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "ca" // Try searching for places inside and outside of canada to test the geocoder
    })
);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add data source and draw initial visiualization of layer
map.on('load', () => {
    map.addSource('canada-country', {
        'type': 'geojson',
        'data': 'https://raw.githubusercontent.com/coethan04/Lab3GGR472/refs/heads/main/map-3.geojson'
    });

    map.addLayer({
        'id': 'canada-country-fill',
        'type': 'fill',
        'source': 'canada-country',
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': 0.5,
            'fill-outline-color': 'white'
        }
    });

    // Add another visualization of the polygon of provinces. Note we do not use addsource again
    map.addLayer({
        'id': 'canada-country-hl', // Update id to represent highlighted layer
        'type': 'fill',
        'source': 'canada-country',
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': 1, // Opacity set to 1
            'fill-outline-color': 'white'
        },
        'filter': ['==', ['get', 'PRUID'], ''] // Set an initial filter to return nothing
    });

});



/*--------------------------------------------------------------------
SIMPLE CLICK EVENT
--------------------------------------------------------------------*/
// map.on('click', 'canada-country-fill', (e) => {

//     console.log(e);     // e is the event info triggered and is passed to the function as a parameter (e)
//                         Explore console output using Google DevTools

//     let provname = e.features[0].properties.PRENAME;
//     console.log(provname);

// });


/*--------------------------------------------------------------------
ADD POP-UP ON CLICK EVENT
--------------------------------------------------------------------*/
map.on('mouseenter', 'canada-country-fill', () => {
    map.getCanvas().style.cursor = 'pointer'; // Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'canada-country-fill', () => {
    map.getCanvas().style.cursor = ''; // Switch cursor back when mouse leaves provterr-fill layer
    map.setFilter("canada-provterr-hl", ['==', ['get', 'PRUID'], '']); // Reset filter for highlighted layer after mouse leaves feature
});


map.on('click', 'canada-country-fill', (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Province/Territory:</b> " + e.features[0].properties.PRENAME + "<br>" +
            "Population: " + e.features[0].properties.POP2021) // Use click event properties to write text for popup
        .addTo(map); // Show popup on map
});


/*--------------------------------------------------------------------
SIMPLE HOVER EVENT
// --------------------------------------------------------------------*/
map.on('mousemove', 'canada-country-fill', (e) => {

    // Set the filter of the provinces-hl to display the feature you're hovering over
    // e.features[0] is the first feature in the array and properties.PRUID is the Province ID for that feature
    map.setFilter('canada-country-hl', ['==', ['get', 'PRUID'], e.features[0].properties.PRUID]);

});

