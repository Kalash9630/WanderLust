async function initializeMap() {
  const mapElement = document.getElementById("map");

  if (!mapElement) return;
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(locationName)}&access_token=${mapboxgl.accessToken}&limit=1`,
    );

    if (!response.ok) {
      throw new Error("Location could not be found");
    }

    const data = await response.json();

    if (data.features.length === 0) {
      document.getElementById("map").textContent = "Location not found.";
      return;
    }

    const [longitude, latitude] = data.features[0].geometry.coordinates;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom: 13,
    });

    // Create custom marker
    const markerElement = document.createElement("div");

    markerElement.className = "custom-map-marker";

    markerElement.innerHTML = `
            <div class="marker-glow">
                <div class="marker-icon">
                    <i class="fa-solid fa-house home-icon"></i>
                    <i class="fa-solid fa-compass compass-icon"></i>
                </div>
            </div>
        
            <div class="marker-tooltip">
                <strong>WanderLust</strong>
                <span>Your next getaway starts here!</span>
            </div>
        `;

    new mapboxgl.Marker({
      element: markerElement,
      anchor: "center",
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    map.addControl(new mapboxgl.NavigationControl());
  } catch (error) {
    console.error(error);
    document.getElementById("map").textContent =
      "Unable to load the map for this location.";
  }
}

initializeMap();
