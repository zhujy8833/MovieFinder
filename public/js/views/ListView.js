/**
 * Created with JetBrains WebStorm.
 * User: jz
 * Date: 4/16/14
 * Time: 18:16
 * To change this template use File | Settings | File Templates.
 */

//Initialize ListView, Mapview

define(["backbone", "underscore", "jquery", "mustache", "text!/templates/list.mustache.html"],
    function(Backbone, _, $, Mustache, template){

        var ListView = Backbone.View.extend({


            initialize : function(options) {
                var view = this;
                view.data = options.data || [];
                view.render();

            },

            render : function() {
                var view = this;
                view.$el.html(Mustache.render(template, {data : view.data}));

            }
        });
        return ListView;
    });