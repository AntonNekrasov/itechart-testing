/*globals rpApp */

/**
 * Provides the main handlers for view elements:
 * Implements read/search/sort/delete methods
 * Defines the table structure
 */
rpApp.builder = function ($settings) {

    //if(!$settings || $settings.length === 0) throw new Error("Unable to find settings tag in template. \n Please, define ");
    //
    //var self = this,
    //    //service = rpApp.Service,
    //    cells = getCells(),
    //
    //// -- Public methods

        ///**
        // * Displays the paginated list of entities.
        // *
        // * @param page Current page number (starts from 0)
        // * @param pageSize Page size
        // * @param order Column to be sorted
        // * @param orderDirection Order direction
        // * @param filter Filter applied on entities
        // * @param callback Callback function, to be implemented, after server response is returned
        // */
        //query = function(page, pageSize, order, orderDirection, filter, callback) {
        //
        //    if(!page || !pageSize) throw new Error("page or page size are undefined!");
        //
        //    var $eltList = $("[data-action=\"list\"]");
        //    return $eltList.each(function() {
        //        var $elt = $(this),
        //            url = $settings.attr("data-list-url") + "?p=" + page + "&s=" + pageSize,
        //            success = new rpApp.Callback(function(params) {
        //                var reply = params.reply,
        //                    entities = reply.data["list"],
        //                    rows = "";
        //                if(reply.status === "Success") {
        //                    /*writing rows*/
        //                    $elt.empty();
        //                    for(var n in entities) {
        //                        if (entities.hasOwnProperty(n)) {
        //                            var e = entities[n];
        //                            rows += row(e);
        //                        }
        //                    }
        //                    $elt.html(rows);
        //                    /*updating paging*/
        //                    setPaging(reply.data.page, reply.data.total)
        //                }
        //            }, self, {}),
        //            error = new rpApp.Callback(function(params) {
        //                var reply = params.reply;
        //                var message = reply.responseText ? reply.responseText : reply.statusText;
        //                //TODO: update;
        //                alert(message);
        //            }, self, {});
        //
        //        if(order) url +="&ob=" + order;
        //        if(orderDirection || orderDirection === 0) url += "&od=" + orderDirection;
        //        if(filter) url += "&f=" + filter;
        //
        //        service.send(url, "GET", {}, success, error, callback)
        //    });
        //},
        ///**
        // * Removes selected entity.
        // */
        //remove = function(id, name, callback) {
        //    var url = $settings.attr("data-delete-url") + id,
        //        $modal = $("#rp-confirmation");
        //
        //    $modal.find(".header").html("Delete \"" + name + "\"");
        //    $modal.find(".description").html("Are you sure you want to delete \"" + name + "\" record?");
        //    $modal.modal("show");
        //
        //    $modal.find(".rp-confirm").off("click").on("click", function() {
        //
        //        var success = new rpApp.Callback(function(params){
        //            var reply = params.reply;
        //            if(reply.status === "Success") {
        //                $modal.modal("hide");
        //            }
        //        }, self, {}),
        //            error = new rpApp.Callback(function(params){
        //                var reply = params.reply;
        //                var message = reply.responseText ? reply.responseText : reply.statusText;
        //                //TODO: update;
        //                alert(message);
        //        }, self, {});
        //
        //        service.send(url, "DELETE", {}, success, error, callback);
        //    });
        //
        //},
        ///**
        // * Redirects to an entity edit page.
        // *
        // * @param url Redirection URL
        // * @param id Entity id (optional)
        // */
        //editPage = function(url, id) {
        //    location.href = id? url + "?id=" + id : url;
        //};

    // -- Private functions

    ///**
    // * Creates table row.
    // */
    //function row(entity) {
    //    var signature = $settings.attr("data-entity-signature"),
    //        content = "<tr data-action=\"editPage\" data-id=\"" + entity.id + "\" data-entity=\"" + entity[signature] + "\">";
    //    for(var i = 0, lth = cells.length; i < lth; i++) {
    //        var ctt = cells[i];
    //        content += "<td>" + (entity[ctt.name] || " ") + "</td>";
    //    }
    //    content += "<td><i class=\"large trash icon doubling\" data-action=\"delete\"></i></td></tr>";
    //
    //    return content;
    //}

    ///**
    // * Prepares the list of table cells for the specific page. Requires settings tag to be defined.
    // */
    //function getCells() {
    //    var dataCells = $settings.attr("data-cells"),
    //        SEPARATOR1 = ",",
    //        SEPARATOR2 = "//",
    //        result = [];
    //
    //    if(!dataCells) throw new Error("Table cells are not specified in template settings!");
    //
    //    var cellsArr = dataCells.split(SEPARATOR1);
    //    for(var i = 0, lth = cellsArr.length; i < lth; i++ ) {
    //        var cell = cellsArr[i].trim(),
    //            sepIndex = cell.indexOf(SEPARATOR2);
    //
    //        result.push({
    //            "name": cell.substring(0, sepIndex),
    //            "title": cell.substring(sepIndex + SEPARATOR2.length)
    //        });
    //    }
    //    return result;
    //}
    ///**
    // * Sets the current page, and total amount of pages, disables buttons, if there are no previous/next pages
    // *
    // * @param current is the current page
    // * @param total is the total amount of pages (note: pages, not records)
    // */
    //function setPaging(current, total) {
    //
    //    var $pagination = $("[data-action=\"pagination\"]"),
    //        $info = $(".rp-pagination-info"),
    //        $empty = $("rp-pagination-empty");
    //
    //    $pagination.find(".button").removeClass("disabled");
    //    if(current <= 1) {
    //        $pagination.find(".rp-previous").addClass("disabled");
    //    }
    //    if (current >= total) {
    //        $pagination.find(".rp-next").addClass("disabled");
    //    }
    //
    //    if(total == 0) {
    //        $info.addClass("hidden");
    //        $empty.removeClass("hidden");
    //    } else {
    //        $info.removeClass("hidden");
    //        $empty.addClass("hidden");
    //        $pagination.attr("data-current", current).attr("data-total", total);
    //        $pagination.find("[data-value=\"total\"]").html(total);
    //        $pagination.find(".rp-current").val(current);
    //    }
    //}

    // -- Init

    ///**
    // * Renders table header by cell list
    // */
    //(function renderTable() {
        //$("[data-action=\"header\"]").each(function(){
        //    var $table = $(this),
        //        content = "<thead><tr>";
        //
        //    for(var i = 0, lth = cells.length; i < lth; i++) {
        //        var ctt = cells[i];
        //        content += "<th data-map=\"" + ctt["name"] + "\">" + ctt["title"] + "</th>"
        //    }
        //
        //    /*adding table body*/
        //    content += "<th></th><tbody data-action=\"list\"></tbody>";
        //    /*adding footer */
        //    content += "<tfoot><tr data-action=\"pagination\" data-total=\"\" data-current=\"\">" +
        //        "<th colspan=\"" + (cells.length + 1) + "\">" +
        //            "<span class=\"rp-pagination-info\">" +
        //                "<span>Page&nbsp;</span>" +
        //                "<div class=\"ui transparent input\">" +
        //                    "<input type=\"text\" class=\"rp-current\">" +
        //                "</div>" +
        //                "&nbsp;of&nbsp;<span data-value=\"total\"></span>&nbsp;" +
        //            "</span>" +
        //            "<span class=\"rp-pagination-empty hidden\">&nbsp;No records&nbsp;</span>" +
        //            "<div class=\"rp-page-buttons ui buttons\">" +
        //                "<div class=\"ui button disabled rp-previous\">Previous</div>" +
        //                "<div class=\"or\" data-text=\"\"></div>" +
        //                "<div class=\"ui black disabled button rp-next\">Next</div>" +
        //            "</div>" +
        //        "</th></tr></tfoot>";
        //    $table.html(content);
        //});
    //})();

    //return {
    //    query: query,
    //    remove: remove,
    //    editPage: editPage
    //}
};
