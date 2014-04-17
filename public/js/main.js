require.config({
    shim: {
        "backbone": {
            deps:['jquery','underscore'],
            exports: "Backbone"
        },
        "backbone-relational": {
            deps: ['backbone']
        },
        "jquery-ui": {
            deps: ['jquery']
        }

    },
    paths: {
        //"zepto": "vendor/zepto/zepto.min",
        "jquery": "vendor/jquery",
        "underscore": "vendor/underscore",
        "backbone": "vendor/backbone",
        //"backbone-relational": "vendor/backbone-relational/backbone-relational",
        //"foundation": "vendor/foundation/js/foundation.min",
        "mustache": "vendor/mustache",
        "text": "vendor/require-text",
        //"modernizr": "vendor/foundation/js/vendor/custom.modernizr",
        //"moment": "vendor/moment.min",
        //"codemirror": "vendor/codemirror/lib/codemirror.min",
        //"select2" : "../select2/select2.min",
        "jquery-ui": "//code.jquery.com/ui/1.10.4/jquery-ui"

    }

     // script(type="text/javascript", src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDf7Q0VyGUbeEpknXulcLsBdBMgT4AQZgE&sensor=true") -->
//     script(type="text/javascript").
//       function initialize() {
//         var mapOptions = {
//           center: new google.maps.LatLng(-34.397, 150.644),
//           zoom: 8
//         };
//         var map = new google.maps.Map(document.getElementById("map-canvas"),
//             mapOptions);
//       }
//       google.maps.event.addDomListener(window, 'load', initialize);


});

require(["jquery"], function($){
    function initialize() {
        var mapOptions = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 15
        };
        var geocoder = new google.maps.Geocoder();;
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

        var addresses = ["1425 Fillmore Street", "706 Mission Street", "Golden Gate Park", "720 Market Street", "553 8th Ave", "1489 Webster Street"];

        $.each(addresses, function(index, addr){
            geocoder.geocode( { 'address': addr}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });

                    marker.openInfoWindowHtml(place.address + '<br>' +
                        '<b>Country code:</b> ' + place.AddressDetails.Country.CountryNameCode);

                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });
        });

    };
   // $(document).ready(initialize);
    require(["backbone", "routers/IndexRoute"],function(Backbone, IndexRoute){
          var indexRoute = new IndexRoute();
          Backbone.history.start();
    });
    //google.maps.event.addDomListener(window, 'load', initialize);
});