define(["backbone", "views/MainView", "jquery"],
    function(Backbone, MainView, $){

        var IndexRoute = Backbone.Router.extend({
            initialize : function(){
                var router = this;
            },

            routes : {
                "" : "index"
            },
            index : function() {
                var router = this;

                $.ajax({
                    type: "GET",
                    url : "/movies",
                    success : function(data) {
                        new MainView({
                            router : router,
                            movies : data
                        });
                    },
                    error : function() {
                        new MainView({router : router});
                    }
                })

            }
        });
        return IndexRoute;

    })