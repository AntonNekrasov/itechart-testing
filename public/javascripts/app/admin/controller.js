/* globals rpApp */
rpApp.admin = {};

rpApp.admin.controller = function() {
    var self = this,
        service = rpApp.Service,
        list = (function () {
            var me = $("[data-action='list']"),
                query = function() {
                    me.each(function() {
                        var $elt = $(this),
                            url = $elt.attr("data-url"),
                            success = new rpApp.Callback(function(params){
                                var reply = params.reply,
                                    entities = reply.data["list"],
                                    nodes = "";
                                if(reply.status === "Success") {
                                    $elt.empty();
                                    for(var n in entities) {
                                        var e = entities[n];
                                        nodes += node(e.name, "description"); //TODO: update with real description;
                                    }
                                    console.log(nodes);
                                    $elt.html(nodes);
                                }
                            }, self, {}),
                            error = new rpApp.Callback(function(params){
                                    var reply = params.reply;
                                    var message = reply.responseText ? reply.responseText : reply.statusText;
                                    //TODO: update;
                                    alert(message);

                                }, self, {}
                            );

                        service.send(
                            url,
                            "GET",
                            {},
                            success,
                            error

                        )
                    });
                };

            function node(title, description) {
                return "<div class=\"item\">" +
                    "<i class=\"large trash icon doubling\"></i>" +
                    "<div class=\"content\">" +
                        "<div class=\"header\">" + title + "</div>" +
                        "<div>" + description + "</div>" +
                    "</div>" +
                "</div>"
            }

            return {
                query: query
            }
        })();

    list.query();


};

