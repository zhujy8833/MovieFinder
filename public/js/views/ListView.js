
define(["backbone", "underscore", "jquery", "mustache", "text!/templates/list.mustache.html"],
    function(Backbone, _, $, Mustache, template){

        var ListView = Backbone.View.extend({

            events : {
                "click li.list-item" : "selectMarker"
            },

            initialize : function(options) {
                var view = this;
                view.data = options.data || [];
                view.parentView = options.parentView;
                view.mapView = options.mapView;
                view.render();

            },

            selectMarker : function(event) {
                var view = this;
                var entryId = $(event.currentTarget).data("id");
                if(view.mapView) {
                    view.mapView.mapTo(entryId);
                }
            },

            render : function() {
                var view = this;
                view.$el.html(Mustache.render(template, {data : view.data}));

            }
        });
        return ListView;
    });