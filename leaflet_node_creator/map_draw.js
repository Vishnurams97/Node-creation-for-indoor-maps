'use strict'
var node_number = 0;
var json_data = {};
var node_name_id_dict = {};
var linking_node =0;
var linking_node_parent = 0;
var configuring_time = 0;
var node_name_input = document.getElementById('input');
var currently_click_node;
var configure_node = 0;
var node_Icon = L.icon({
    iconUrl: 'blue_marker.gif',
    iconSize:     [30, 30], 
    iconAnchor:   [15, 15]
});
var url="Your post URL";

var map = L.map('map',{
    // minZoom: 2,
    maxZoomout: 8,
    maxZoom: 6,
    center: [0, 0],
    attributionControl: false,
    crs: L.CRS.Simple
}).setView({lat: 0, lng: 0}, 2);

// map.setView(map.layerPointToLatLng([0,0]),2);

// L.marker(m_2_l({x:15.2,y:0})).addTo(map);
map.setView(centre(m_2_l({x:0,y:12}),m_2_l({x:18.2,y:0})));

var s = m_2_l({x:0,y:12});
var t = m_2_l({x:18.2,y:0});
function centre(x,y){
    return {'lat':(x.lat+y.lat)/2,'lng':(x.lng+y.lng)/2}
}

function m_2_l(dict){
    var lat = dict.x;
    var lng = dict.y;
    return {'lat':lng*10,'lng':lat*10} 
}

function latlng_to_mtrs(dict){
    var x = dict.lat;
    var y = dict.lng;
    return {'y':x/10,'x':y/10} 
}

L.marker(latlng_to_mtrs({'lat': 0, 'lng': 0}));

function latlng_to_mtrs(dict){
    var x = dict.lat;
    var y = dict.lng;
    return {'y':x/10,'x':y/10} 
}

var imageUrl = './floor.png',  imageBounds = [s, t];

var myMarker = L.marker([0,0], {title: "MyPoint", alt: "The Big I", draggable: true})
		// .addTo(map)
		.on('dragend', function() {
            var coord = myMarker.getLatLng();
            console.log(coord);
            L.marker(coord, {title: "MyPoint", draggable: true,icon:node_Icon,interactive: true}).addTo(map)
            .on('click', function (e) {
                // Fires on each feature in the layer
                console.log(e.target._leaflet_id);
            });
		});

var image = L.imageOverlay(imageUrl, imageBounds,{interactive: true}).addTo(map);
var drawnItems = L.featureGroup().addTo(map);
map.addControl(new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        }, 
        remove: true 
    },
    draw: {
        polygon:false,
        circle:false
    }
}));

map.on(L.Draw.Event.CREATED, function (e) {
        var type = e.layerType;
        var layer = e.layer;
        if (type === 'marker') {
            console.log(json_data);
        }
        if (type === 'circle') {
            // layer.editing.enable();            
            console.log(layer._latlng);
            L.marker(layer._latlng).addTo(map);
            console.log(layer._latlng);
        }
        if (type === 'rectangle') {
            // layer.editing.enable();json_data["image_bounds"]
            // image.setBounds(image.getBounds());
            json_data["image_bounds"] = image.getBounds();
            json_data["centre"] = map.getCenter();
            // layer._latlngs[0][2],layer._latlngs[0][3]];
            image.addTo(map);
            console.log(json_data["image_bounds"]);
        }
        // Do whatever else you need to. (save to db; add to map etc)
        map.addLayer(layer);
     });
     map.on('draw:editmove', function (e) {
        var layers = e.layers;
        // image.setBounds(json_data.image_bounds);
        console.log(layers);
    });

var currently_click_node_data = 0;
var latlngs = [[ 77.8418477505252,-22.148437500000004],
[ 77.76758238272801,228.86718750000003],[ -36.03133177633188,228.51562500000003]
,[ -33.43144133557529,-22.5,]];

var myStyle = {
    "color": "#74b9ff",
    "weight": 5,
    "opacity": 0.65
};var configure_node_data;
var lat_lng = 0;
var naming_node = 0;
var dummy;
// var popup = L.popup()
// .setLatLng([0,0])
// .setContent('Node name:<input id="pop_up"/>')
// .openOn(map);
var  links_completed = 0;
map.on('click', function(e) { 
    node_number+=1;
    var node = L.marker(e.latlng, {title: node_number, draggable: true,icon:node_Icon,interactive: true
            }).addTo(map)
        .on('click', function (e) {
            if(links_completed == 1){
                alert("Enter name of node :"+e.target._leaflet_id);
                naming_node = e.target._leaflet_id;
            }
            else{
                if(configuring_time === 1){
                    var myLines = [{
                        "type": "LineString",
                        "coordinates": [[e.latlng.lng,e.latlng.lat],[configure_node_data.latlng.lng,configure_node_data.latlng.lat]]
                    }];
                        L.geoJSON(myLines, {
                        style: myStyle
                        }).addTo(map);
    
                    currently_click_node = e.target._leaflet_id.toString();
                    if(configure_node!='0'){
                        fetch_node_data(configure_node,currently_click_node);
                        fetch_node_data_of_clicked(currently_click_node,configure_node);
                        console.log(json_data);
                    }
                }
                else{
                        alert("Configuration for node: "+e.target._leaflet_id);
                        configure_node_data = e;
                        configure_node = e.target._leaflet_id.toString();
                        // node_name_input.value = '';
                }
            }
        });
    node._leaflet_id = node_number; 
    json_data[node_number]={
    "bottom": 0, 
    "left": 0, 
    "name": "", 
    "right": 0, 
    "top": 0, 
    "val": e.latlng}
    console.log(json_data);
});

function fix_name(){
    var a = naming_node.toString();
    json_data[a].name = node_name_input.value;
    console.log(json_data);
    node_name_input.value = '';
}
function fetch_node_data_of_clicked(currently_click_node,config_node){

    if(linking_node_parent === 'right'){
        json_data[currently_click_node]["right"] = config_node
    }
    if(linking_node_parent === 'top'){
        json_data[currently_click_node]["top"] = config_node
    }
    if(linking_node_parent === 'bottom'){
        json_data[currently_click_node]["bottom"] = config_node
    }
    if(linking_node_parent === 'left'){
        json_data[currently_click_node]["left"] = config_node
    }
    return 0
};
function fetch_node_data(configure_node,currently_click_node){
    console.log(linking_node)
    if(linking_node === 'right'){
        json_data[configure_node]['right'] = currently_click_node
    }
    if(linking_node === 'top'){
        json_data[configure_node]['top'] = currently_click_node
    }
    if(linking_node ==='bottom'){
        json_data[configure_node]['bottom'] = currently_click_node
    }
    if(linking_node === 'left'){
        json_data[configure_node]['left'] = currently_click_node
    }
    return 0
}
function clearMap() {
    for(var i in map._layers) {
        if(map._layers[i]._path) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch(e) {
                ;
            }
        }
    }
}
function undo(){
    clearMap();
    json_data = {};
}

function link(dir){
    if(configure_node=='0'){alert("No node selected!");}
    else{if(dir=='r'){
        linking_node = "right";
        linking_node_parent = "left";
        configuring_time = 1;
    }
    else if(dir=='t'){
        linking_node = "top";
        linking_node_parent = "bottom";
        configuring_time = 1;
    }
    else if(dir=='l'){
        linking_node = "left";
        linking_node_parent = "right";
        configuring_time = 1;
    }
    else if(dir=='b'){
        linking_node = "bottom";
        linking_node_parent = "top";
        configuring_time = 1;
    }}
}
function pop(){
    // console.log(document.getElementById('pop_up').value);
    links_completed =1;
    console.log("Links created");
}

function fix(){
    configuring_time = 0;
    // if(node_name_input.value == ''){alert('Please Enter Node name');configuring_time = 1;}
    // else{json_data[configure_node].name = node_name_input.value}
    // console.log(json_data);
}

$.extend({
    jpost: function(url, body) {
        return $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(body),
            contentType: "application/json",
            dataType: 'json'
        });
    }
});

function post_to_db(){

 var postData={
     "floor1": json_data
 };

$.jpost(url,postData).then(res => {
    alert("Posted To DB");
});
}

//    L.marker(
//         map.layerPointToLatLng(
//             map.containerPointToLayerPoint(
//             e.layerPoint
//         )
//       )
//     ).addTo(map);

    // function hi(){
// for (var i = 0; i<100; i++) {
//     var myLines = [{
//     "type": "LineString",
//     "coordinates": [[219.37500000000003+i, 74.59010800882325], [ 215.15625000000003,-15.623036831528264],[72.39570570653261, 28.828125000000004 +i]]
// }];
//     L.geoJSON(myLines, {
//     style: myStyle
//         }).addTo(map);
// }
// }

// polygon.on('click', function (e) {
//     image.setBounds(polygon.getBounds());
//     });
// setInterval(hi,1000);

//     handler.disable();
// });
// var hello = "2344";
// var greenIcon = L.icon({
//     iconUrl: 'temperature.png',
//     iconSize:     [50, 50], // s// point from which the popup should open relative to the iconAnchor
// });
// var a = L.marker([71.63599288330609, 24.9609375], {icon: greenIcon}).addTo(map);
// L.marker([ 10.8333059, 209.882812], {icon: greenIcon}).addTo(map);
// L.marker([ 71.41124235697256, 127.96875000000001], {icon: greenIcon}).addTo(map);

// var c = a.bindPopup("<b>Temperature:20 Degrees<br>Pressure:xyx</b><button>Hii</button>").openPopup();
// // icon.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// marker.on('mouseover', function(e){
//     marker.openPopup();
// });

// var polygon = L.polygon(latlngs, {draggable: true, color: 'red'}).addTo(map);
// zoom the map to the polygon
// map.fitBounds(polygon.getBounds());
// var myLines = [{
//     "type": "LineString",
//     "coordinates": [[219.37500000000003, 74.59010800882325], [ 215.15625000000003,-15.623036831528264],[72.39570570653261, 28.828125000000004 ]]
// }];
