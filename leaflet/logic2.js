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
var tornado_alley = new L.LayerGroup();
var year2000 = new L.LayerGroup();
var year2010 = new L.LayerGroup();
var year2020 = new L.LayerGroup();
// Alternate method and same as above
// var earthquakes = L.layerGroup();

// Create overlay object to hold our overlay layer
var overlayMaps = {
  "Tornadoes in IL": tornadoes,
  "Tornado Alley 2020": tornado_alley,
  "IL 2000": year2000,
  "IL 2010": year2010,
  "IL 2020": year2020
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
      color: "black",
      fillColor: FScaleColor(data[i].TOR_F_SCALE),
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: data[i].TOR_SIZE*3
    }).bindPopup("<h3>" + data[i].BEGIN_DATE_TIME + "</h3> <hr> </p>Source: " + data[i].SOURCE + "</p>F Scale: " + data[i].TOR_F_SCALE + "</p>").addTo(tornadoes);
  }
});

//L.circle([41.28, -90.24], 5000).addTo(myMap);

  // Here are some additional examples:  https://geospatialresponse.wordpress.com/2015/07/26/leaflet-geojson-pointtolayer/ 

// add tornado alley
var Url = "../Tornado Alley_2020.csv";

d3.csv(Url, function(data) {
    console.log(data)
    console.log(data[0].TOR_F_SCALE)
  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
 for (var j = 0; j < data.length; j++) {
    //location = [data[i].BEGIN_LAT, data[i].BEGIN_LON];
    var location = L.latLng(data[j].BEGIN_LAT, data[j].BEGIN_LON);
    L.circle(location, {
      fillOpacity: 0.75,
      color: "black",
      fillColor: FScaleColor(data[j].TOR_F_SCALE),
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: data[j].TOR_SIZE*3
    }).bindPopup("<h3>" + data[j].BEGIN_DATE_TIME + "</h3> <hr> </p>Source: " + data[j].SOURCE + "</p>F Scale: " + data[j].TOR_F_SCALE + "</p>").addTo(tornado_alley);
  }
});

 // add 2000 
 var Url1 = "../Tornadoes_2000.csv";

 d3.csv(Url1, function(data) {
     console.log(data)
     console.log(data[0].TOR_F_SCALE)
   // Once we get a response, send the data.features object to the createFeatures function
 
   // Create a GeoJSON layer containing the features array on the earthquakeData object
   // Run the onEachFeature function once for each piece of data in the array
  for (var k = 0; k < data.length; k++) {
     //location = [data[i].BEGIN_LAT, data[i].BEGIN_LON];
     var location = L.latLng(data[k].BEGIN_LAT, data[k].BEGIN_LON);
     L.circle(location, {
       fillOpacity: 0.75,
       color: "black",
       fillColor: FScaleColor(data[k].TOR_F_SCALE),
       // Setting our circle's radius equal to the output of our markerSize function
       // This will make our marker's size proportionate to its population
       radius: data[k].TOR_SIZE*3
     }).bindPopup("<h3>" + data[k].BEGIN_DATE_TIME + "</h3> <hr> </p>Source: " + data[k].SOURCE + "</p>F Scale: " + data[k].TOR_F_SCALE + "</p>").addTo(year2000);
   }
 });

  // add 2010 
var Url2 = "../Tornadoes_2010.csv";

d3.csv(Url2, function(data) {
    console.log(data)
    console.log(data[0].TOR_F_SCALE)
  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
 for (var l = 0; l < data.length; l++) {
    //location = [data[i].BEGIN_LAT, data[i].BEGIN_LON];
    var location = L.latLng(data[l].BEGIN_LAT, data[l].BEGIN_LON);
    L.circle(location, {
      fillOpacity: 0.75,
      color: "black",
      fillColor: FScaleColor(data[l].TOR_F_SCALE),
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: data[l].TOR_SIZE*3
    }).bindPopup("<h3>" + data[l].BEGIN_DATE_TIME + "</h3> <hr> </p>Source: " + data[l].SOURCE + "</p>F Scale: " + data[l].TOR_F_SCALE + "</p>").addTo(year2010);
  }
});

 // add 2020 
 var Url3 = "../Tornadoes_2020.csv";

 d3.csv(Url3, function(data) {
     console.log(data)
     console.log(data[0].TOR_F_SCALE)
   // Once we get a response, send the data.features object to the createFeatures function
 
   // Create a GeoJSON layer containing the features array on the earthquakeData object
   // Run the onEachFeature function once for each piece of data in the array
  for (var m = 0; m < data.length; m++) {
     //location = [data[i].BEGIN_LAT, data[i].BEGIN_LON];
     var location = L.latLng(data[m].BEGIN_LAT, data[m].BEGIN_LON);
     console.log(data[m].TOR_F_SCALE),
     L.circle(location, {
       fillOpacity: 0.75,
       color: "black",
       fillColor: FScaleColor(data[m].TOR_F_SCALE),
       
       // Setting our circle's radius equal to the output of our markerSize function
       // This will make our marker's size proportionate to its population
       radius: data[m].TOR_SIZE*3
     }).bindPopup("<h3>" + data[m].BEGIN_DATE_TIME + "</h3> <hr> </p>Source: " + data[m].SOURCE + "</p>F Scale: " + data[m].TOR_F_SCALE + "</p>").addTo(year2020);
   }
 });


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["EFU", "EF0", "EF1", "EF2", "EF3", "Unrated"],
        labels = [];

    //loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += '<h3>F Scale</h3>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + FScaleColor(grades[i]) + '"></i> ' +
            grades[i] + '<br>';
    }

    return div;
};

legend.addTo(myMap);

function circleRadius(TOR_LENGTH){
    return TOR_LENGTH;
}
console.log(FScaleColor("EF0"))
//color changes with fscale
function FScaleColor(fscale){
  if (fscale === "EFU"){
    color = "purple";
  }

  else if (fscale === "EF0"){
    color = "blue";
  }

  else if (fscale === "EF1"){
    color = "yellow"
  }

  else if (fscale === "EF2"){
    color = "orange"
  }

  else if (fscale === "EF3"){
    color = "red"
  }

  else {
    color = "grey"
  }

  return color;
}
