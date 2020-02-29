var map = L.map('map',{
    // minZoom: 2,
    maxZoomout: 8,
    maxZoom: 6,
    center: [0, 0],
    attributionControl: false,
    crs: L.CRS.Simple
}).setView({lat: 0, lng: 0}, 2);

function meters_to_lat_lng(dict){
    var lat = dict.x;
    var lng = dict.y;
    return {'lat':lng*10,'lng':lat*10} 
}

// for(var i = 0;i<=18;i+=1){
//     L.marker(meters_to_lat_lng({x:i,y:0})).addTo(map);
// }

// for(var i = 0;i<=12;i+=1){
//     L.marker(meters_to_lat_lng({x:0,y:i})).addTo(map);
// }
a = L.marker(meters_to_lat_lng({'x':0,'y':0}), { draggable: true,interactive: true}).addTo(map);
b = L.marker(meters_to_lat_lng({'x':0,'y':10}), { draggable: true,interactive: true}).addTo(map);
c = L.marker(meters_to_lat_lng({'x':10,'y':0}), { draggable: true,interactive: true}).addTo(map);
d = L.marker(meters_to_lat_lng({'x':10,'y':10}), { draggable: true,interactive: true}).addTo(map);

function centre(x,y){
    return {'lat':(x.lat+y.lat)/2,'lng':(x.lng+y.lng)/2}
}

var imageUrl = './floor.png';
var imageBounds = [meters_to_lat_lng({x:0,y:11.5}),meters_to_lat_lng({x:18.2,y:0})];

var image = L.imageOverlay(imageUrl, [a.getLatLng(),b.getLatLng(),c.getLatLng(),d.getLatLng()],{interactive: true}).addTo(map);

map.setView(centre(meters_to_lat_lng({x:0,y:11.5}),meters_to_lat_lng({x:18.2,y:0})));

var app = {
    initialize:function(){
        document.addEventListener("deviceready", app.start_ble_scan(), false);
    },
    start_ble_scan:function() {
        
    }
}

a.on('move',function(){
    console.log(a.getLatLng());
    // image.setBounds([a.getLatLng(),b.getLatLng(),c.getLatLng(),d.getLatLng()]).addTo(map);
    image.setBounds([a.getLatLng(),b.getLatLng(),c.getLatLng(),d.getLatLng()]).addTo(map);
})
b.on('move',function(){
    console.log(a.getLatLng());
    // image.setBounds([a.getLatLng(),b.getLatLng(),c.getLatLng(),d.getLatLng()]).addTo(map);
    image.setBounds([a.getLatLng(),b.getLatLng(),c.getLatLng(),d.getLatLng()]).addTo(map);
})
c.on('move',function(){
    console.log(a.getLatLng());
    // image.setBounds([a.getLatLng(),b.getLatLng(),c.getLatLng(),d.getLatLng()]).addTo(map);
    image.setBounds([a.getLatLng(),b.getLatLng(),c.getLatLng(),d.getLatLng()]).addTo(map);
})

d.on('move',function(){
    console.log(a.getLatLng());
    // image.setBounds([a.getLatLng(),b.getLatLng(),c.getLatLng(),d.getLatLng()]).addTo(map);
    image.setBounds([a.getLatLng(),b.getLatLng(),c.getLatLng(),d.getLatLng()]).addTo(map);
    console.log(image.getBounds());
})