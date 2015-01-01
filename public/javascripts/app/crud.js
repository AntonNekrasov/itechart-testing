/*globals rpApp */

/**
 * Provides the main handlers for view elements:
 * Implements read/search/sort/delete methods
 * Defines the table structure
 */
rpApp.Crud = function ($settings) {
    var self = this,
        service = rpApp.Service,
        cells = getCells(),

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
            var $eltList = $("[data-action=\"list\"]");
            return $eltList.each(function() {
                var $elt = $(this),
                    url = $settings.attr("data-list-url"),
                    success = new rpApp.Callback(function(params){
                        var reply = params.reply,
                            entities = reply.data["list"],
                            rows = "";
                        if(reply.status === "Success") {
                            $elt.empty();
                            for(var n in entities) {
                                if (entities.hasOwnProperty(n)) {
                                    var e = entities[n];
                                    rows += row(e);
                                }
                            }
                            $elt.html(rows);
                        }
                    }, self, {}),
                    error = new rpApp.Callback(function(params){
                            var reply = params.reply;
                            var message = reply.responseText ? reply.responseText : reply.statusText;
                            //TODO: update;
                            alert(message);

                        }, self, {}
                    );

                service.send(url, "GET", {}, success, error)
            });
        },

        /**
         * Redirects to an entity edit page.
         *
         * @param url Redirection URL
         * @param id Entity id (optional)
         */
        editPage = function(url, id) {
            location.href = id? url + "?id=" + id : url;
        };

    // -- Private functions
    /**
     * Creates table row.
     */
    function row(entity) {
        var content = "<tr data-action=\"editPage\" data-id=\"" + entity.id + "\">";
        for(var i = 0, lth = cells.length; i < lth; i++) {
            var ctt = cells[i];
            content += "<td>" + (entity[ctt.name] || " ") + "</td>";
        }
        content += "<td><i class=\"large trash icon doubling\" data-action=\"delete\"></i></td></tr>"

        return content;
    }

    /**
     * Prepares the list of table cells for the specific page. Requires settings tag to be defined.
     */
    function getCells() {
        var dataCells = $settings.attr("data-cells"),
            SEPARATOR1 = ",",
            SEPARATOR2 = "//",
            result = [];

        if(!dataCells) throw new Error("Table cells are not specified in template settings!");

        var cellsArr = dataCells.split(SEPARATOR1);
        for(var i = 0, lth = cellsArr.length; i < lth; i++ ) {
            var cell = cellsArr[i].trim(),
                sepIndex = cell.indexOf(SEPARATOR2);

            result.push({
                "name": cell.substring(0, sepIndex),
                "title": cell.substring(sepIndex + SEPARATOR2.length)
            });
        }
        return result;
    }

    // -- Init

    /**
     * Renders table header by cell list
     */
    (function renderTable() {
        $("[data-action=\"header\"]").each(function(){
            var $table = $(this),
                content = "<thead><tr>";

            for(var i = 0, lth = cells.length; i < lth; i++) {
                var ctt = cells[i];
                content += "<th data-map=\"" + ctt["name"] + "\">" + ctt["title"] + "</th>"
            }

            content += "<th></th><tbody data-action=\"list\"></tbody>";
            $table.html(content);
        });
    })();

    return {
        query: query,
        editPage: editPage
    }
};
