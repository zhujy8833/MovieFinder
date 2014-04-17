
define(["backbone", "underscore", "jquery", "mustache", "text!/templates/map.mustache.html", "text!/templates/marker.mustache.html"],
    function(Backbone, _, $, Mustache, template, markerTemplate){

        var MapView = Backbone.View.extend({
            initialize : function(options) {
                var view = this;
                view.data = options.data || [];
                view.render();
                view.mapInit();
                view.paint();
            },

            mapInit : function() {
                var view = this;
                var mapOptions = {
                    center: new google.maps.LatLng(-34.397, 150.644),
                    zoom: 15
                };
                var geocoder = new google.maps.Geocoder();;
                var map = new google.maps.Map(view.$("#map-canvas")[0],
                    mapOptions);
                view.geocoder = geocoder;
                view.map = map;
            },

            render : function() {
                var view = this;
                view.$el.html(Mustache.render(template));
            },

            paint : function() {
                var view = this;
                var addresses = _.pluck(view.data, "Locations").map(function(addr){
                    return [addr, "San Francisco"].join(" ");
                });
                $.each(view.data, function(index, d){
                    view.geocoder.geocode( { 'address': [d["Locations"],"San Francisco"].join(" ")}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            view.map.setCenter(results[0].geometry.location);
                            var marker = new google.maps.Marker({
                                map: view.map,
                                position: results[0].geometry.location,
                                title : Mustache.render(markerTemplate, d)
                            });
                            //marker.openInfoWindowHtml(Mustache.render(markerTemplate, d));
                            google.maps.event.addListener(marker, 'click', function() {

                                if (marker.getAnimation() != null) {
                                    marker.setAnimation(null);
                                } else {
                                    marker.setAnimation(google.maps.Animation.BOUNCE);
                                }
                            });

                        } else {
                            alert("Geocode was not successful for the following reason: " + status);
                        }
                    });
                });
                //view.$el.html(Mustache.render(template));
            }
        });
        return MapView;
    });