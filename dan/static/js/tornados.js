var myMap = L.map("map", {
    center: [40.6331, -89.3985],
    zoom: 6
  });

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 15,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap); 

//d3.csv("data/Tornados_2000.csv", function(data, err) {
d3.csv("data/Tornados_2000.csv").then(function(data, err) {
   if (err) throw err;

   var heatArray = [];

   for (var i = 0; i < data.length; i++) {
      var location = [data[i].BEGIN_LAT, data[i].BEGIN_LON];
      console.log(location);
          
      var gradnt = 0;
      switch (data[i].TOR_F_SCALE) {
        case 'F0':
          gradnt = "0.5";
          break;
        case 'F1':
          gradnt = "0.6";
          break;
        case 'F2':
          gradnt = "0.7";
          break;
        case 'F3':
          gradnt = "0.8";
          break;
        case 'F4':
          gradnt = "0.9";
          break;
        case 'F5':
          gradnt = "1";
          break;
      }


       if (location) {
           heatArray.push([data[i].BEGIN_LAT,data[i].BEGIN_LON,gradnt]);
       }

    }
    console.log(heatArray);
    var heat = L.heatLayer(heatArray, {
        radius: 30,
        blur: 1,
        max: 1,
        maxOpacity: .9,
        minOpacity: .3,
        gradient: {
          '0.4': 'blue',
          '0.6': 'cyan',
          '0.7': 'lime',
          '0.8': 'yellow',
          '1.0': 'red'
        }
    }).addTo(myMap);

});


