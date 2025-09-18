import { useEffect, useRef } from "react";

// --- HELPER HOOK for Leaflet Map ---
// This hook encapsulates map logic and ensures it doesn't crash if Leaflet is not loaded.
export const useMap = (mapContainerRef, coords, disasters = []) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const disasterMarkersRef = useRef([]);
  const labelPositionsRef = useRef([]); // Track label positions to prevent overlapping

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Helper function to find non-overlapping position for label
  const findLabelPosition = (centerLat, centerLng, radius, labelType, existingPositions) => {
    const baseOffset = (radius / 111000) + 0.005; // Convert meters to degrees + small offset
    const positions = [
      { lat: centerLat + baseOffset, lng: centerLng }, // North
      { lat: centerLat - baseOffset, lng: centerLng }, // South
      { lat: centerLat, lng: centerLng + baseOffset }, // East
      { lat: centerLat, lng: centerLng - baseOffset }, // West
      { lat: centerLat + baseOffset * 0.7, lng: centerLng + baseOffset * 0.7 }, // Northeast
      { lat: centerLat + baseOffset * 0.7, lng: centerLng - baseOffset * 0.7 }, // Northwest
      { lat: centerLat - baseOffset * 0.7, lng: centerLng + baseOffset * 0.7 }, // Southeast
      { lat: centerLat - baseOffset * 0.7, lng: centerLng - baseOffset * 0.7 }, // Southwest
    ];

    const minDistance = 0.01; // Minimum distance between labels in degrees

    for (const pos of positions) {
      let hasCollision = false;
      for (const existing of existingPositions) {
        const distance = calculateDistance(pos.lat, pos.lng, existing.lat, existing.lng);
        if (distance < minDistance * 111000) { // Convert to meters
          hasCollision = true;
          break;
        }
      }
      if (!hasCollision) {
        return pos;
      }
    }

    // If all positions have collisions, use the first position with a small random offset
    const randomOffset = (Math.random() - 0.5) * 0.01;
    return {
      lat: positions[0].lat + randomOffset,
      lng: positions[0].lng + randomOffset
    };
  };

  useEffect(() => {
    // IMPORTANT: Leaflet's JS and CSS must be included in your main index.html for this to work.
    // <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    // <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    if (!window.L || !mapContainerRef.current) {
      console.log("Leaflet not loaded or map container not ready");
      return;
    }

    const { latitude, longitude } = coords || { latitude: 19.0760, longitude: 72.8777 };
    console.log("Map coordinates:", latitude, longitude);

    if (!mapRef.current) {
      console.log("Initializing map");
      mapRef.current = window.L.map(mapContainerRef.current).setView([latitude, longitude], 14);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
      console.log("Map initialized");
    }

    // Update user location marker
    if (coords) {
      if (!markerRef.current) {
        markerRef.current = window.L.marker([coords.latitude, coords.longitude])
          .addTo(mapRef.current)
          .bindPopup("Your Location");
      } else {
        markerRef.current.setLatLng([coords.latitude, coords.longitude]);
      }
      mapRef.current.setView([coords.latitude, coords.longitude]);
    }

    // Clear existing disaster markers
    disasterMarkersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    disasterMarkersRef.current = [];
    labelPositionsRef.current = []; // Clear label positions

    // Add disaster markers and zones
    console.log("Disasters data:", disasters);
    if (disasters && disasters.length > 0) {
      disasters.forEach(disaster => {
        console.log("Processing disaster:", disaster);
        if (disaster.location?.coordinates) {
          const [lng, lat] = disaster.location.coordinates;
          console.log("Adding marker at:", lat, lng);
          
          // Create disaster center marker (red)
          const disasterIcon = window.L.divIcon({
            className: 'disaster-marker',
            html: `<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
        
        const emergencyContacts = {
          "Earthquake": { phone: "108", description: "Emergency Services" },
          "Flood": { phone: "108", description: "Flood Control Room" },
          "Fire": { phone: "101", description: "Fire Department" },
          "Hurricane": { phone: "108", description: "Disaster Management" },
          "Tornado": { phone: "108", description: "Emergency Services" },
          "Tsunami": { phone: "108", description: "Tsunami Warning Center" },
          "Landslide": { phone: "108", description: "Geological Survey" },
          "Other": { phone: "108", description: "Emergency Services" }
        };

        const emergency = emergencyContacts[disaster.type] || emergencyContacts["Other"];
        const severity = ["Earthquake", "Tsunami", "Hurricane"].includes(disaster.type) ? "HIGH" : "MEDIUM";
        const severityColor = severity === "HIGH" ? "bg-red-500" : "bg-orange-500";

        const marker = window.L.marker([lat, lng], { icon: disasterIcon })
          .addTo(mapRef.current)
          .bindPopup(`
            <div class="p-3 min-w-64">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-red-600 text-lg">${disaster.type}</h3>
                <span class="px-2 py-1 text-xs text-white rounded-full ${severityColor}">${severity}</span>
              </div>
              
              <p class="text-sm text-gray-700 mb-3">${disaster.description || 'No description available'}</p>
              
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                <div><span class="font-medium">Radius:</span> ${disaster.radius}km</div>
                <div><span class="font-medium">Created:</span> ${new Date(disaster.createdAt).toLocaleDateString()}</div>
              </div>

              <div class="bg-red-50 p-3 rounded-lg border border-red-200 mb-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-medium text-gray-600">Emergency Contact</p>
                    <p class="text-sm font-bold text-red-600">${emergency.phone}</p>
                    <p class="text-xs text-gray-500">${emergency.description}</p>
                  </div>
                  <a href="tel:${emergency.phone}" class="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-red-700 transition-colors">
                    Call Now
                  </a>
                </div>
              </div>

              ${disaster.resources ? `
                <div class="bg-gray-50 p-2 rounded">
                  <p class="text-xs font-medium text-gray-600 mb-1">Resources Available:</p>
                  <div class="grid grid-cols-2 gap-1 text-xs text-gray-600">
                    ${disaster.resources.food > 0 ? `<span>🍞 Food: ${disaster.resources.food}</span>` : ''}
                    ${disaster.resources.medikits > 0 ? `<span>🏥 Medikits: ${disaster.resources.medikits}</span>` : ''}
                    ${disaster.resources.water > 0 ? `<span>💧 Water: ${disaster.resources.water}</span>` : ''}
                    ${disaster.resources.blankets > 0 ? `<span>🛏️ Blankets: ${disaster.resources.blankets}</span>` : ''}
                  </div>
                </div>
              ` : ''}
            </div>
          `);
        disasterMarkersRef.current.push(marker);

        // Create zone circles based on radius
        const radiusKm = disaster.radius || 5; // Default 5km if not specified
        
        // Red zone (0-33% of radius) - High danger
        const redZoneRadius = (radiusKm * 0.33) * 1000; // Convert to meters
        const redZone = window.L.circle([lat, lng], {
          radius: redZoneRadius,
          color: 'red',
          fillColor: 'red',
          fillOpacity: 0.2,
          weight: 2
        }).addTo(mapRef.current);
        disasterMarkersRef.current.push(redZone);

        // Orange zone (33-66% of radius) - Medium danger
        const orangeZoneRadius = (radiusKm * 0.66) * 1000; // Convert to meters
        const orangeZone = window.L.circle([lat, lng], {
          radius: orangeZoneRadius,
          color: 'orange',
          fillColor: 'orange',
          fillOpacity: 0.15,
          weight: 2
        }).addTo(mapRef.current);
        disasterMarkersRef.current.push(orangeZone);

        // Green zone (66-100% of radius) - Safe zone
        const greenZoneRadius = radiusKm * 1000; // Convert to meters
        const greenZone = window.L.circle([lat, lng], {
          radius: greenZoneRadius,
          color: 'green',
          fillColor: 'green',
          fillOpacity: 0.1,
          weight: 2
        }).addTo(mapRef.current);
        disasterMarkersRef.current.push(greenZone);

        // Add zone labels with collision detection
        const labelConfigs = [
          { type: 'red', radius: redZoneRadius, text: 'HIGH DANGER', color: 'rgba(220, 38, 38, 0.95)', width: 80 },
          { type: 'orange', radius: orangeZoneRadius, text: 'MEDIUM DANGER', color: 'rgba(234, 88, 12, 0.95)', width: 90 },
          { type: 'green', radius: greenZoneRadius, text: 'SAFE ZONE', color: 'rgba(34, 197, 94, 0.95)', width: 70 }
        ];

        labelConfigs.forEach(config => {
          const position = findLabelPosition(lat, lng, config.radius, config.type, labelPositionsRef.current);
          
          // Add this position to the tracking array
          labelPositionsRef.current.push(position);
          
          const label = window.L.marker([position.lat, position.lng], {
            icon: window.L.divIcon({
              className: `zone-label ${config.type}-zone-label`,
              html: `
                <div style="
                  background-color: ${config.color};
                  color: white;
                  padding: 4px 8px;
                  border-radius: 6px;
                  font-size: 11px;
                  font-weight: bold;
                  text-align: center;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  border: 1px solid rgba(255,255,255,0.2);
                  white-space: nowrap;
                  min-width: ${config.width}px;
                  pointer-events: none;
                ">${config.text}</div>
              `,
              iconSize: [config.width, 24],
              iconAnchor: [config.width / 2, 12]
            })
          }).addTo(mapRef.current);
          
          disasterMarkersRef.current.push(label);
        });
        }
      });
    } else {
      console.log("No disasters to display");
      // Add a test marker to verify map is working
      if (mapRef.current) {
        const testIcon = window.L.divIcon({
          className: 'test-marker',
          html: `<div style="background-color: blue; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [15, 15],
          iconAnchor: [7, 7]
        });
        
        const testMarker = window.L.marker([latitude, longitude], { icon: testIcon })
          .addTo(mapRef.current)
          .bindPopup("Test marker - Map is working!");
        console.log("Added test marker");
      }
    }

  }, [coords, disasters, mapContainerRef]);
};
