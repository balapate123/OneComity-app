// Standard Dark Map Style from Snazzy Maps: https://snazzymaps.com/style/2/midnight-commander
// Or a similar common dark theme for Google Maps
export const darkMapStyle = [
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
        { "saturation": 36 },
        { "color": "#b3b3b3" }, // Lighter text for dark background
        { "lightness": 40 }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
        { "visibility": "on" },
        { "color": "#000000" }, // Black stroke for contrast
        { "lightness": 16 }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
        { "visibility": "off" } // Hide default icons, if desired
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#222222" }, // Darker admin areas
        { "lightness": 20 }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        { "color": "#000000" },
        { "lightness": 17 },
        { "weight": 1.2 }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
        { "color": "#1a1a1a" }, // Dark landscape
        { "lightness": 20 }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        { "color": "#222222" }, // Dark POIs
        { "lightness": 21 }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        { "color": "#333333" }, // Dark highways
        { "lightness": 17 }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        { "color": "#000000" },
        { "lightness": 29 },
        { "weight": 0.2 }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        { "color": "#2b2b2b" }, // Dark arterial roads
        { "lightness": 18 }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        { "color": "#222222" }, // Dark local roads
        { "lightness": 16 }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        { "color": "#111111" }, // Dark transit lines
        { "lightness": 19 }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        { "color": "#000000" }, // Very dark water, almost black
        { "lightness": 17 }
      ]
    }
  ];
