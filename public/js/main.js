require.config({
    shim: {
        "backbone": {
            deps:['jquery','underscore'],
            exports: "Backbone"
        },
        "jquery-ui": {
            deps: ['jquery']
        }

    },
    paths: {
        "jquery": "vendor/jquery",
        "underscore": "vendor/underscore",
        "backbone": "vendor/backbone",
        "mustache": "vendor/mustache",
        "text": "vendor/require-text",
        "jquery-ui": "//code.jquery.com/ui/1.10.4/jquery-ui"

    }

});

require(["jquery","backbone", "routers/MainRoute"],function($, Backbone, IndexRoute){
      var indexRoute = new IndexRoute();
      Backbone.history.start();
});