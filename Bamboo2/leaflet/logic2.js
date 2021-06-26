// Overview
// Below is a very common format for Leaflet
//
// I like to define all the functions at the top of my scripts because I can view what the functions does before
// reading the code.  When putting a function at the top of the page, you may need to be carefull about the order
// of the functions.  Most of the time you can have functions anywhere - at the bottom, top or in the middle of
// the code.  One exception is if a user defined function is also used inside a user defined function then the function
// loading might be affected.  

// Javascipt Order Article:  https://www.jsdiaries.com/does-javascript-function-order-matter/



// Store our API endpoint inside queryUrl

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

 // Define streetmap and darkmap layers
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap
  };
  
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [ 40.6331, -89.3985 ],
    zoom: 7,
    layers: [streetmap]     //default selected layer
    });
// if more than one layer to L is listed the one that shows up 
// is the one defined last above myMap declaration

// Add streetmap tile to map; if only one tile defined then this is a good way of doing this.
// If only one tile layer then the following will be used "L.control.layers(null, overlayMaps, " later in the code
streetmap.addTo(myMap);
// if multiple tiles are being used then the above code is not needed.  The multiple tiles will be added
// when "L.control.layers(baseMaps, overlayMaps, " 


// create layer; will attach data later on
var tornadoes = new L.LayerGroup();
// Alternate method and same as above
// var earthquakes = L.layerGroup();

// Create overlay object to hold our overlay layer
var overlayMaps = {
  "Tornadoes": tornadoes,
};

// Create a layer control
// Pass in our baseMaps and overlayMaps
// All layers are added through these lines of code
// if only one tile layer is being used then the basemaps tile group can be 
// replaced with null.  This will prevent a tile button from showing in the
// upper right corner of the screen
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

var queryUrl = "../Tornadoes_2000_2010_2020.csv";

//d3.request("../Tornadoes_2000_2010_2020.csv")
  //.mimeType("text/csv")
  //.response(function (xhr) { return d3.csvParse(xhr.responseText);  })
  //.get(function(data) {
   // console.log(data);
 // });
// Perform a GET request to the query URL
d3.csv(queryUrl, function(data) {
    console.log(data)
    console.log(data[0].TOR_F_SCALE)
  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
 for (var i = 0; i < data.length; i++) {
    //location = [data[i].BEGIN_LAT, data[i].BEGIN_LON];
    var location = L.latLng(data[i].BEGIN_LAT, data[i].BEGIN_LON);
    L.circle(location, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: FScaleColor(+data[i].MAGNITUDE),
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: data[i].MAGNITUDE*98
    }).bindPopup("<h3>" + data[i].BEGIN_DATE_TIME + "</h3> <hr> </p>Magnitude: " + data[i].MAGNITUDE + "</p>").addTo(tornadoes);
  }
});

//L.circle([41.28, -90.24], 5000).addTo(myMap);

  // Here are some additional examples:  https://geospatialresponse.wordpress.com/2015/07/26/leaflet-geojson-pointtolayer/ 

 


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [80, 40, 15, 8, 5, 0],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += '<h3>F Scale</h3>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + FScaleColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

function circleRadius(MAGNITUDE){
    return MAGNITUDE;
}

//color changes with fscale
function FScaleColor(fscale){
  if (fscale > 80){
    color = "purple";
  }

  else if (fscale > 40){
    color = "blue";
  }

  else if (fscale > 15){
    color = "green"
  }

  else if (fscale > 8){
    color = "yellow"
  }

  else if (fscale > 5){
    color = "orange"
  }

  else {
    color = "red"
  }

  return color;
}
