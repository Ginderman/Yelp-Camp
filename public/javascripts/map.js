
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'details-map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center:mapCoordinates, // starting position [lng, lat]
        zoom: 4, // starting zoom
    });

    const marker = new mapboxgl.Marker()
        .setLngLat(mapCoordinates)
    
        .addTo(map);

        map.addControl(new mapboxgl.NavigationControl());


