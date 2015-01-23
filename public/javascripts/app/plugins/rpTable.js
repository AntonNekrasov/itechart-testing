/**
 * jQuery table plugin
 *
 * It has methods for deleting, opening, querying, sorting & ordering records
 */
(function( $ ) {
    "use strict";

    // -- Constants & globals

    var service = rpApp.Service,
        ASCENDING = "ascending",
        DESCENDING = "descending",
        DESC = 0,
        ASC = 1;

    // -- Init

    $.fn.rpTable = function( method, callback ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.rpTable' );
            return null;
        }
    };

    // -- Render

    /**
     * Renders table header by cell list
     */
    function render($table, settings) {

        var content = "<thead><tr>",
            columns = settings.columns,
            colSpan = columns.length + (settings.deletable? 1 : 0);

        for(var i = 0, lth = columns.length; i < lth; i++) {
            var ctt = columns[i];
            content += "<th data-map=\"" + ctt["name"] + "\">" + ctt["title"] + "</th>"
        }

        /*adding table body*/
        content += "<th></th><tbody data-action=\"list\"></tbody>";
        /*adding footer */
        content += "<tfoot data-settings=" + JSON.stringify(settings) + "><tr data-action=\"pagination\" data-total=\"\" data-current=\"\">" +
            "<th colspan=\"" + colSpan + "\">" +
                "<span class=\"rp-pagination-info\">" +
                    "<span>Page&nbsp;</span>" +
                    "<div class=\"ui transparent input\">" +
                        "<input type=\"text\" class=\"rp-current\">" +
                    "</div>" +
                    "&nbsp;of&nbsp;<span data-value=\"total\"></span>&nbsp;" +
                "</span>" +
                "<span class=\"rp-pagination-empty hidden\">&nbsp;No records&nbsp;</span>" +
                "<div class=\"rp-page-buttons ui buttons\">" +
                    "<div class=\"ui button disabled rp-previous\">Previous</div>" +
                    "<div class=\"or\" data-text=\"\"></div>" +
                    "<div class=\"ui black disabled button rp-next\">Next</div>" +
                "</div>" +
            "</th></tr></tfoot>";
        $table.html(content);
    }

    // -- Subscription

    function subscribe(tag, settings) {
        var $tag = $(tag);

        $tag.on("click", "[data-action=\"editPage\"]", function() {_edit.apply(this, [settings])})
            .on("click", "[data-action=\"delete\"]", function(e) {_delete.apply(this, [e])})
            .on("click", "thead th", function() {_sort.apply(this, [])})
            .on("click", ".rp-previous", function() {_previous.apply(this, [])})
            .on("click", ".rp-next", function(){_next.apply(this, [])})


    }

    // -- Private functions

    /**
     * Creates table row.
     */
    function _row(entity, settings) {

        var signature = settings.signature,
            content = "<tr data-action=\"editPage\" data-id=\"" + entity.id + "\" data-entity=\"" + entity[signature] + "\">",
            columns = settings.columns;
        for(var i = 0, lth = columns.length; i < lth; i++) {
            var ctt = columns[i];
            content += "<td>" + (entity[ctt.name] || " ") + "</td>";
        }
        content += "<td><i class=\"large trash icon doubling\" data-action=\"delete\"></i></td></tr>";

        return content;
    }

    /**
     * Handlers sorting
     */
    function _sort() {
        var $this = $(this),
            orderBy = $this.attr("data-map"),
            $table = $this.parents("table"),
            $th = $table.find("thead th"),
            situation = sit($table),
            filter = situation.filter,
            asc = $this.hasClass(ASCENDING),
            callback = new rpApp.Callback(function() {
                $th.removeClass("sorted").removeClass(ASCENDING).removeClass(DESCENDING);
                $this.addClass("sorted");
                $this.addClass((asc ? DESCENDING : ASCENDING));
            }, self, {}),
            page = situation.page.current,
            pageSize = situation.page.size;

        methods.query.apply($table, [page, pageSize, orderBy, asc ? 0 : 1, filter, callback]);
    }

    /**
     * Redirects to the entity edit page
     *
     * @param settings are the plugin settings, containing edit url
     */
    function _edit(settings) {
        var $this = $(this),
            id = $this.attr("data-id"),
            url = settings.url.edit;

        location.href = id? url + "?id=" + id : url;
    }

    /**
     * Handles deleting entity
     *
     * @param e Event object, used for suppressing default behaviour (namely opening edit page)
     */
    function _delete(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this),
            $parent = $this.parents("tr"),
            id = $parent.attr("data-id"),
            $table = $this.parents("table"),
            name = $parent.attr("data-entity"),
            callback = new rpApp.Callback(function() {
                var situation = sit($table),
                    orderBy = situation.order.by,
                    orderDirection = situation.order.direction,
                    filter = situation.filter,
                    pageSize = situation.page.size,
                    page = situation.page.current;

                $table.rpTable("query", page, pageSize, orderBy, orderDirection, filter);
            }, self, {});
        methods.remove.apply($table, [id, name, callback]);
    }

    /**
     * Returns current sorting/filtering/paging state
     */
    function sit($tag) {
        var $th = $tag.find("thead th"),
            $sorted = $th.filter(".sorted"),
            $pagination = $("[data-action=\"pagination\"]"),
            situation = {};

        situation.filter = $tag.attr("data-filter");
        situation.order = {};
        situation.order.by = $sorted.length > 0 ? $sorted.attr("data-map") : "";
        if($sorted.length > 0 && $sorted.hasClass(DESCENDING)) {
            situation.order.direction = DESC;
        } else {
            situation.order.direction = ASC;
        }
        situation.page = {};
        situation.page.total = $pagination.attr("data-total");
        situation.page.current = $pagination.attr("data-current");
        situation.page.size = $tag.attr("data-page-size");

        return situation;
    }

    function _previous() {
        var $table = $(this).parents("table"),
            situation = sit($table),
            orderBy = situation.order.by,
            pageSize = situation.page.size,
            orderDirection = situation.order.direction,
            filter = situation.filter,
            page = --situation.page.current;

        if(page > 0) methods.query.apply($table, [page, pageSize, orderBy, orderDirection, filter]);
    }

    function _next() {
        var $table = $(this).parents("table"),
            situation = sit($table),
            orderBy = situation.order.by,
            pageSize = situation.page.size,
            orderDirection = situation.order.direction,
            filter = situation.filter,
            page = ++situation.page.current;

        if(page <= situation.page.total) methods.query.apply($table, [page, pageSize, orderBy, orderDirection, filter]);
    }

    /**
     * Returns the list of settings
     */
    function _settings($tag) {
        return JSON.parse($tag.find("tfoot").first().attr("data-settings"));
    }

    /**
     * Sets the current page, and total amount of pages, disables buttons, if there are no previous/next pages
     *
     * @param current is the current page
     * @param total is the total amount of pages (note: pages, not records)
     */
    function setPaging(current, total) {
        var $pagination = $("[data-action=\"pagination\"]"),
            $info = $(".rp-pagination-info"),
            $empty = $("rp-pagination-empty");

        $pagination.find(".button").removeClass("disabled");
        if(current <= 1) {
            $pagination.find(".rp-previous").addClass("disabled");
        }
        if (current >= total) {
            $pagination.find(".rp-next").addClass("disabled");
        }

        if(total == 0) {
            $info.addClass("hidden");
            $empty.removeClass("hidden");
        } else {
            $info.removeClass("hidden");
            $empty.addClass("hidden");
            $pagination.attr("data-current", current).attr("data-total", total);
            $pagination.find("[data-value=\"total\"]").html(total);
            $pagination.find(".rp-current").val(current);
        }
    }

    // -- Public methods definitions

    var methods = {
        /**
         * Init method is the default method, called to init widget
         *
         * @param options is a set of setting, used for customizing widget. If one or more settings are absent, default ones used instead
         */
        init: function(options) {
            var self = this;

            if(!options || options.length === 0) throw new Error("Unable to find settings tag in template. \n Please, define ");

            self.settings = $.extend({}, $.fn.rpTable.defaults, options);
            return this.each(function() {
                var $this = $(this);
                render.apply(self, [$this, self.settings]);
                subscribe.apply(self, [$this, self.settings]);
            });
        },
        /**
         * Removes selected entity.
         */
        remove: function(id, name, callback) {
            return this.each(function() {
                var $elt = $(this),
                    url = _settings($elt).url.delete + id,
                    $modal = $("#rp-confirmation");

                $modal.find(".header").html("Delete \"" + name + "\"");
                $modal.find(".description").html("Are you sure you want to delete \"" + name + "\" record?");
                $modal.modal("show");

                $modal.find(".rp-confirm").off("click").on("click", function() {

                    var success = new rpApp.Callback(function(params){
                            var reply = params.reply;
                            if(reply.status === "Success") {
                                $modal.modal("hide");
                            }
                        }, self, {}),
                        error = new rpApp.Callback(function(params){
                            var reply = params.reply;
                            var message = reply.responseText ? reply.responseText : reply.statusText;
                            //TODO: update;
                            alert(message);
                        }, self, {});

                    service.send(url, "DELETE", {}, success, error, callback);
                });
            });
        },
        /**
         * Displays the paginated list of entities.
         *
         * @param page Current page number (starts from 0)
         * @param pageSize Page size
         * @param order Column to be sorted
         * @param orderDirection Order direction
         * @param filter Filter applied on entities
         * @param callback Callback function, to be implemented, after server response is returned
         */
        query: function(page, pageSize, order, orderDirection, filter, callback) {
            if(!page || !pageSize) throw new Error("page or page size are undefined!");
            return this.each(function() {

                var $elt = $(this),
                    $tBody = $elt.find("[data-action=\"list\"]"),
                    settings = _settings($elt),
                    url = settings.url.list + "?p=" + page + "&s=" + pageSize,
                    success = new rpApp.Callback(function(params) {
                        var reply = params.reply,
                            entities = reply.data["list"],
                            rows = "";
                        if(reply.status === "Success") {
                            /*writing rows*/
                            $tBody.empty();
                            for(var n in entities) {
                                if (entities.hasOwnProperty(n)) {
                                    var e = entities[n];
                                    rows += _row(e, settings);
                                }
                            }

                            $tBody.html(rows);
                            /*updating paging*/
                            setPaging(reply.data.page, reply.data.total);
                            /*updating sit*/
                            $elt.attr("data-page-size", pageSize);
                            $elt.attr("data-filter", filter);
                        }
                    }, self, {}),
                    error = new rpApp.Callback(function(params) {
                        var reply = params.reply;
                        var message = reply.responseText ? reply.responseText : reply.statusText;
                        //TODO: update;
                        alert(message);
                    }, self, {});

                if(order) url +="&ob=" + order;
                if(orderDirection || orderDirection === 0) url += "&od=" + orderDirection;
                if(filter) url += "&f=" + filter;

                service.send(url, "GET", {}, success, error, callback)
            });
        }
    };

    // -- Defaults

    $.fn.rpTable.defaults = {
        "url": {
            "list": "/",
            "delete": "/",
            "edit": "/"
        },
        "deletable": true,
        "signature": "name",
        "columns": [
            {
                "name": "name",
                "title": "title",
                "width": "100%"
            }
        ]
    }

})( jQuery );