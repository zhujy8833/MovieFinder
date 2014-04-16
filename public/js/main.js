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
        "backbone": "vendor/backbone/backbone",
        //"backbone-relational": "vendor/backbone-relational/backbone-relational",
        //"foundation": "vendor/foundation/js/foundation.min",
        "mustache": "vendor/mustache/mustache",
        //"modernizr": "vendor/foundation/js/vendor/custom.modernizr",
        //"moment": "vendor/moment.min",
        //"codemirror": "vendor/codemirror/lib/codemirror.min",
        //"select2" : "../select2/select2.min",
        //"jquery-ui": "vendor/jquery-ui/ui/jquery-ui"

    }

     // script(type="text/javascript", src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDf7Q0VyGUbeEpknXulcLsBdBMgT4AQZgE&sensor=true") -->
     // script(type="text/javascript").
     //  function initialize() {
     //    var mapOptions = {
     //      center: new google.maps.LatLng(-34.397, 150.644),
     //      zoom: 8
     //    };
     //    var map = new google.maps.Map(document.getElementById("map-canvas"),
     //        mapOptions);
     //  }
     //  google.maps.event.addDomListener(window, 'load', initialize); 

});