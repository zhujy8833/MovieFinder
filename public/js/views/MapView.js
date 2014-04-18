
define(["backbone", "underscore", "jquery", "mustache", "text!/templates/marker.mustache.html"],
    function(Backbone, _, $, Mustache, markerTemplate){
        var timeoutId;
        var MapView = Backbone.View.extend({
            markers : {},
            initialize : function(options) {
                var view = this;
                view.data = options.data || [];
                view.map = options.map;
                view.geocoder = options.geocoder;
                view.parentView = options.parentView;
                view.clearMarkers();
                view.paint();
            },

            mapTo : function(entryId) {
                var view = this;
                var selectedMarker = view.markers[entryId];
                if(selectedMarker) {
                    view.map.setCenter(selectedMarker.position);
                    view.markerOpenWindow(selectedMarker);
                    view.toggleBounce(selectedMarker); 
                }
            },

            markerOpenWindow : function(marker, allowMultiple) {
                var view = this;
                if(!allowMultiple) {
                    _.each(view.markers,function(marker){
                        marker.infoWindow.close();
                        marker.setAnimation(null);
                    });
                }
                if(marker){
                    var infoWindow = marker.infoWindow;
                    infoWindow.open(view.map , marker);
                }
            },

            toggleBounce : function(marker) {
                var view = this;
//                currentIcon.setAnimation(null);
                if(marker.getAnimation() != null) {
                    marker.setAnimation(null);
                } else {
                    clearTimeout(timeoutId);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    timeoutId = setTimeout(function(){
                        marker.setAnimation(null); 
                    }, 1400);
                }
            },
            clearMarkers : function() {
                var view = this;
                var currentMarkers = view.parentView.currentMarkers || [];
                _.each(currentMarkers, function(marker){
                    marker.setMap(null);
                });
                view.parentView.currentMarkers = [];
            },

            paint : function() {
                var view = this;
                var apiKey = "AIzaSyDxNWkQW4R5jRZ51_iYnAWvEKA8hVGHF2s";
                var addresses = _.pluck(view.data, "Locations").map(function(addr){
                    return [addr, "San Francisco"].join(" ");
                });
                $.each(view.data, function(index, d){
                    $.ajax({
                        type : "GET",
                        url : "https://maps.googleapis.com/maps/api/geocode/json",
                        data : {
                            address : addresses[index],
                            sensor : true,
                            key : apiKey
                        },
                        success : function(data) {
                            if(data.status === google.maps.GeocoderStatus.OK) {
                                 var marker = new google.maps.Marker({
                                    map: view.map,
                                    position: data.results[0].geometry.location
                                    //title : Mustache.render(markerTemplate, d)
                                    
                                });
                                if(index === 0) {
                                    view.map.setCenter(data.results[0].geometry.location);
                                }
                                marker.markerId = d.id;
                                marker.infoWindow = new google.maps.InfoWindow({
                                    content: Mustache.render(markerTemplate, d),
                                    maxWidth : 200 
                                });

                                if(!view.markers[d.id]) {
                                    view.markers[d.id] = marker;
                                }
                                view.parentView.currentMarkers.push(marker);

                                google.maps.event.addListener(marker, 'click', function() {
                                    view.markerOpenWindow(marker);
                                    view.toggleBounce(marker);
                                }); 
                            }
                        },
                        error : function() {

                        }
                    });

                });
                
            }
        });
        return MapView;
    });