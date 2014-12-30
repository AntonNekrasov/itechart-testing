/* globals rpApp */
rpApp.admin = {};

rpApp.admin.controller = function() {
    var self = this,
        service = rpApp.Service,
        /**
         * Provides the main handlers for view elements.
         */
        crud = (function () {
            var $eltList = $("[data-action=\"list\"]"),

                // -- Public methods

                /**
                 * Displays the paginated list of entities.
                 *
                 * @param page Current page number (starts from 0)
                 * @param pageSize Page size
                 * @param order Column to be sorted
                 * @param orderDirection Order direction
                 * @param filter Filter applied on entities
                 */
                query = function(page, pageSize, order, orderDirection, filter) {
                    return $eltList.each(function() {
                        var $elt = $(this),
                            url = $elt.attr("data-url"),
                            success = new rpApp.Callback(function(params){
                                var reply = params.reply,
                                    entities = reply.data["list"],
                                    nodes = "";
                                if(reply.status === "Success") {
                                    $elt.empty();
                                    for(var n in entities) {
                                        if (entities.hasOwnProperty(n)) {
                                            var e = entities[n];
                                            nodes += node(e.id, e.name, "description"); //TODO: update with real description;
                                        }
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
                },

                /**
                 * Redirects to an entity edit page.
                 *
                 * @param page Current page number (starts from 0)
                 * @param pageSize Page size
                 * @param order Column to be sorted
                 * @param orderDirection Order direction
                 * @param filter Filter applied on language names
                 */
                editPage = function(url, id) {

                };

            // -- Private functions

            function node(id, title, description) {
                return "<div class=\"item\" data-action=\"editPage\" data-id=\"" + id + "\">" +
                    "<i class=\"large trash icon doubling\"></i>" +
                    "<div class=\"content\">" +
                        "<div class=\"header\">" + title + "</div>" +
                        "<div>" + description + "</div>" +
                    "</div>" +
                "</div>"
            }

            // -- Event handlers

            $("#rp-admin-panel").on("click", "[data-action=\"editPage\"]", function() {
                console.log(this);
            });

            return {
                query: query,
                editPage: editPage
            }
        })();


    crud.query();


};

