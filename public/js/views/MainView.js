/**
 * Created with JetBrains WebStorm.
 * User: jz
 * Date: 4/16/14
 * Time: 18:16
 * To change this template use File | Settings | File Templates.
 */

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


            events: {
               "click top-bar > button" : "buttonClick"
            },

            buttonClick : function() {
                var view = this;
                return function(event) {
                    alert($(event.currentTarget).attr("id"));

                };
            },
            initialize : function(options) {
                var view = this;
                view.router = options.router;
                view.movies = options.movies;
                view.render();


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
                    success : function(data) {
                        var sharedObj = {
                            parentView: view,
                            data : data
                        };
                        var listView = new ListView($.extend({el : "#list"}, sharedObj));
                        var mapView = new MapView($.extend({el : "#map", listView : listView}, sharedObj));
                    },
                    error : function() {

                    }
                });
            },


            render : function() {
                var view = this;
                //var baseUrl = "/movies";
                $("#container").html(view.$el.html(Mustache.render(template)));
                var defaultOpt = {start: 0, num : 10};
                if(view.movies) {
                    view.$("#search-for-movie").autocomplete({
                        source: view.movies,
                        select : function(event, ui) {
                            view.renderViews($.extend({}, defaultOpt, {title : ui.item.value}));
                        }
                    }).on("change", function(e){
                            if(!$(this).val()) {
                                view.renderViews(defaultOpt);
                            }

                        });
                }

                view.renderViews({start: 0, num: 10});
            }
        });
        return MainView;
    });