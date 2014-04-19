//Initialize ListView, Mapview

define(["backbone", "underscore", "jquery", "mustache", "text!/templates/main.mustache.html", "views/ListView", "views/MapView", "jquery-ui"],
    function(Backbone, _, $, Mustache, template, ListView, MapView){
        $.ui.autocomplete.filter = function (array, term) {
            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
            return $.grep(array, function (value) {
                return matcher.test(value.label || value.value || value);
            });
        };
        var MainView = Backbone.View.extend({
            tagName: "div",
            className : "main",
            listControl : {
                start: 0,
                num : 10
            },

            currentMarkers : [],
            events: {
               "click button.control-btn" : "buttonClick"
            },
            mapInit : function() {
                var view = this;
                var mapOptions = {
                    center: new google.maps.LatLng(-34.397, 150.644),
                    zoom: 12
                };
                var geocoder = new google.maps.Geocoder();;
                var map = new google.maps.Map(view.$("#map-canvas")[0],
                    mapOptions);
                view.geocoder = geocoder;
                view.map = map;
            },
            buttonClick : function(event) {
                var view = this;
                var buttonId = $(event.currentTarget).attr("id");
                if($(event.currentTarget).hasClass("disabled")) return;
                if(buttonId === 'previous') {
                    view.listControl.start = view.listControl.start - view.listControl.num; 
                } else if(buttonId === 'next') {
                    view.listControl.start = view.listControl.start + view.listControl.num;
                }

                view.renderViews($.extend({
                    start : view.listControl.start,
                    num : view.listControl.num
                }, view.searchTerm ? {title : view.searchTerm} : {}));
            },

            initialize : function(options) {
                var view = this;
                view.router = options.router;
                view.movies = options.movies;
                view.render();
                view.mapInit();


            },
            renderViews : function(options) {
                var view = this;
                var url = "/data";
                if(options.title) {
                    url = url + "/" + encodeURIComponent(options.title);
                }
                var config = {type : "GET", url : url};
                config.data = {
                    start : options.start,
                    num : options.num
                };
                $.ajax({
                    type : "GET",
                    url : url,
                    data : {
                        start : options.start,
                        num : options.num
                    },
                    success : function(d) {
                        var sharedObj = {
                            parentView: view,
                            data : d.data,
                            dataLength : d.length
                        };
                        //if(view.listControl.start + view.listControl.num >= d.length - 1) {
                        view.$(".top-bar").show();
                        view.$("#next").toggleClass("disabled", view.listControl.start + view.listControl.num >= d.length);
                        view.$("#previous").toggleClass("disabled", view.listControl.start == 0);
                        view.$("#page-text").html([view.listControl.start/view.listControl.num + 1, Math.ceil(d.length/view.listControl.num)].join(" / "));
                        //}
                        view.mapView = new MapView($.extend({el : "#map", map : view.map, geocoder : view.geocoder}, sharedObj));
                        view.listView = new ListView($.extend({el : "#list", mapView : view.mapView}, sharedObj));
                        

                    },
                    error : function() {

                    }
                });
            },

            setListControl : function(opts) {
                var view = this;
                view.listControl.start = opts.start;
                view.listControl.num = opts.num;
            },

            render : function() {
                var view = this;
                $("#container").html(view.$el.html(Mustache.render(template)));
                var defaultOpt = {start: 0, num : 10};
                if(view.movies) {
                    view.$("#search-for-movie").autocomplete({
                        source: view.movies,
                        select : function(event, ui) {
                            view.setListControl(defaultOpt);
                            view.searchTerm = ui.item.value;
                            view.renderViews($.extend({}, defaultOpt, {title : ui.item.value}));
                        }
                    }).on("change", function(e){
                            if(!$(this).val()) {
                                view.searchTerm = null;
                                view.setListControl(defaultOpt);
                                view.renderViews(defaultOpt);
                            }

                        });
                }

                view.renderViews({start: 0, num: 10});
            }
        });
        return MainView;
    });