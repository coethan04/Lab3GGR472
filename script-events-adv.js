
// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY29ldGhhbiIsImEiOiJjbW04Mm9vNTAwem5hMnFwbXA3bm9sYzg1In0.FUDLFtuUAAp3eF1BSszV6g'; //***ADD PUBLIC ACCESS TOKEN*** 

// Initialize map
const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/coethan/cmm9gnlfw001401s1ddxv60r3',
    center: [-95, 63],
    zoom: 3,
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

    // Use GeoJSON file as vector tile creates non-unique IDs for features which causes difficulty when highlighting polygons
    map.addSource('canada-country', {
        'type': 'geojson',
        'data': 'https://raw.githubusercontent.com/coethan04/Lab3GGR472/refs/heads/main/map-3.geojson', // Link to raw github files when in development stage. Update to pages on deployment
        'generateId': true // Create a unique ID for each feature
    });

    // Add layer only once using case expression and feature state for opacity
    map.addLayer({
        'id': 'canada-country-fill',
        'type': 'fill',
        'source': 'canada-country',
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
            ], // CASE and FEATURE STATE expression sets opactity as 0.5 when hover state is false and 1 when updated to true
            'fill-outline-color': 'white'
        },
        // remove source layer as it is not needed for geojson
    });

});



/*--------------------------------------------------------------------
SIMPLE CLICK EVENT
--------------------------------------------------------------------*/
// map.on('click', 'canada-country-fill', (e) => {

//     console.log(e);    // e is the event info triggered and is passed to the function as a parameter (e)
//     Explore console output using Google DevTools

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
});


map.on('click', 'canada-country-fill', (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Province/Territory:</b> " + e.features[0].properties.PRENAME + "<br>" +
            "Population: " + e.features[0].properties.POP2021) // Use click event properties to write text for popup
        .addTo(map); // Show popup on map
})



/*--------------------------------------------------------------------
HOVER EVENT
// --------------------------------------------------------------------*/
let provID = null; // Declare initial province ID as null

map.on('mousemove', 'canada-country', (e) => {
    if (e.features.length > 0)
        // Set hover feature state back to false to remove opacity from previous highlighted polygon
        if (provID !== null)
            map.setFeatureState(
                { source: 'canada-country', id: provID },
                { hover: false }
            );

    provID = e.features[0].id; // Update provID to featureID
    map.setFeatureState(
        { source: 'canada-country', id: provID },
        { hover: true } // Update hover feature state to TRUE to change opacity of layer to 1
    );

});

// If mouse leaves the geojson layer, set all hover states to false and provID variable back to null
map.on('mouseleave', 'canada-country-fill', () => {
    if (provID !== null) {
        map.setFeatureState(
            { source: 'canada-country', id: provID },
            { hover: false }
        );
    }
    provID = null;
});


