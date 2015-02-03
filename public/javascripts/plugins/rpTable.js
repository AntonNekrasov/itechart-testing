/* globals rpApp, messages */

/**
 * jQuery table plugin
 *
 * It has methods for deleting, opening, querying, sorting & ordering records
 * param declarations are replaced with #, as at symbol is reserved by play template engine
 */
(function( $ ) {
    "use strict";

    // -- Constants & globals

    var service = rpApp.Service,
        ASCENDING = "ascending",
        DESCENDING = "descending",
        DESC = 0,
        ASC = 1,
        ORDER_DIR = "&od=",
        ORDER_BY = "&ob=",
        FILTER = "&f=",
        PAGE_SIZE = 5,
        ERR_GLOBAL = "rp-table-flash";

    // -- Init

    /**
     * jQuery table plugin declaration
     *
     * @param method - one of the methods, declared in methods object
     * @param callback - callback function, to be implemented, after method is executed
     */
    $.fn.rpTable = function( method, callback ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === "object" || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( "Method " +  method + " does not exist on jQuery.rpTable" );
            return null;
        }
    };

    // -- Render

    /**
     * Renders table header by cell list
     *
     * @param $table - table jQuery object
     * @param settings - rpTable widget settings
     */
    function render($table, settings) {

        var content = "<thead><tr>",
            columns = settings.columns,
            colSpan = columns.length + (settings.deletable? 1 : 0),
            availableSizes = settings.pageSize.available,
            pageSize = settings.pageSize.default;

        // -- Adding columns
        for(var i = 0, lth = columns.length; i < lth; i++) {
            var ctt = columns[i];
            content += "<th style=\"width: " + ctt.width + "%\" data-map=\"" + ctt.name + "\">" + ctt.title + "</th>";
        }

        // -- Adding table body
        content += "<th></th><tbody data-action=\"list\"></tbody>";

        // -- Adding footer
        content += "<tfoot data-settings=" + JSON.stringify(settings) + "><tr data-action=\"pagination\" data-total=\"\" " +
                "data-current=\"1\" data-page-size = \"" + pageSize + "\">" +
            "<th colspan=\"" + colSpan + "\">" +

            // -- Adding pagination info
            "<span class=\"rp-pagination-info\">" +
                "<span>" + messages("Page") + "&nbsp;</span>" +
                "<div class=\"ui transparent input\">" +
                    "<input type=\"text\" class=\"rp-current\">" +
                "</div>" +
                "&nbsp;" + messages("of") + "&nbsp;<span data-value=\"total\"></span>&nbsp;" +
            "</span>" +

            // -- Adding pagination buttons
            "<span class=\"rp-pagination-empty rp-invisible\">&nbsp;" + messages("List_is_empty") + "&nbsp;</span>" +
            "<div class=\"rp-page-buttons ui buttons\">" +
                "<div class=\"ui button disabled rp-previous\">" + messages("Previous") + "</div>" +
                "<div class=\"or\" data-text=\"\"></div>" +
                "<div class=\"ui black disabled button rp-next\">" + messages("Next") + "</div>" +
            "</div>" +

            // -- Adding page size drop down
            "<div class=\"ui selection dropdown rp-page-size\">" +
                "<input name=\"pageSize\" type=\"hidden\" value=\"" + pageSize + "\">" +
                    "<div class=\"text\"></div>" +
                    "<i class=\"dropdown icon\"></i>" +
                    "<div class=\"menu\">";

        for(var p = 0, lth2 = availableSizes.length; p < lth2; p++) {
            var sizeOption = availableSizes[p];
            content += "<div class=\"item\" data-value=\"" + sizeOption + "\">" + messages("Show_by") + " " + sizeOption + " </div>";
        }
        content += "</div></div></th></tr></tfoot>";

        $table.html(content);
    }

    // -- Subscription

    /**
     * Creates table row.
     *
     * @param tag - table tag to be subscribed on listening events
     * @param settings - rpTable widget settings
     */
    function subscribe(tag, settings) {
        var $tag = $(tag);

        $tag.on("click", "[data-action=\"editPage\"]", function() {
            _edit.apply(this, [settings]);
        }).on("click", "[data-action=\"delete\"]", function(e) {
            _delete.apply(this, [e]);
        }).on("click", "thead th", function() {
            _sort.apply(this, []);
        }).on("click", ".rp-previous", function() {
            _previous.apply(this, []);
        }).on("click", ".rp-next", function(){
            _next.apply(this, []);
        }).find(".rp-page-size").dropdown({
            onChange: function(pageSize) {
                if(pageSize) {
                    _pageSize.apply(tag, [pageSize]);
                }
            }
        });

        $(settings.errSelector.tag).on("click", ".close", function() {
            $(this).parents(settings.errSelector.tag).transition(rpApp.constants.messageAnimation);
            clearTimeout(window[ERR_GLOBAL]);
        });
    }

    // -- Private functions

    function _pageSize(pageSize) {
        /*jshint validthis:true */
        var $this = $(this),
            situation = sit($this),
            orderBy = situation.order.by,
            orderDirection = situation.order.direction,
            filter = situation.filter;

        _query.apply(this, [1, pageSize, orderBy, orderDirection, filter]);
    }

    /**
     * Creates table row.
     *
     * @param entity - record which contains data for the row to be created
     * @param settings - rpTable widget settings
     */
    function _row(entity, settings) {
        var signature = settings.signature,
            content = "<tr data-action=\"editPage\" data-id=\"" + entity.id + "\" data-entity=\"" + entity[signature] + "\">",
            columns = settings.columns;

        for(var i = 0, lth = columns.length; i < lth; i++) {
            var ctt = columns[i],
                supplementary = ctt.supplementary;
            content += "<td>" +
                (entity[ctt.name] || " ");

            if(supplementary.value) {
                content += "<p class=\"rp-supplementary\">" + supplementary.title + ": " + entity[supplementary.value] + "</p>";
            }
            content += "</td>";
        }
        content += "<td>" +
        "<i class=\"large trash icon doubling\" data-action=\"delete\"></i></td></tr>";

        return content;
    }

    /**
     * Handlers sorting
     */
    function _sort() {
        /*jshint validthis:true */
        var $this = $(this),
            orderBy = $this.attr("data-map"),
            $table = $this.parents("table"),
            $th = $table.find("thead th"),
            situation = sit($table),
            filter = situation.filter,
            asc = $this.hasClass(ASCENDING),
            page = situation.page.current,
            pageSize = situation.page.size,

            // -- Callback
            callback = new rpApp.Callback(function() {
                $th.removeClass("sorted").removeClass(ASCENDING).removeClass(DESCENDING);
                $this.addClass("sorted");
                $this.addClass((asc ? DESCENDING : ASCENDING));
            }, self, {});

        _query.apply($table.get(), [page, pageSize, orderBy, asc ? 0 : 1, filter, callback]);
    }

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
    function _query(page, pageSize, order, orderDirection, filter, callback) {
        /*jshint validthis:true */
        if(!page || !pageSize) throw new Error("page or page size are undefined!");

        var $elt = $(this),
            $tBody = $elt.find("[data-action=\"list\"]"),
            settings = _settings($elt),
            url = settings.url.list + "?p=" + page + "&s=" + pageSize,

            // -- Success callback
            success = new rpApp.Callback(function(params) {
                var reply = params.reply,
                    entities = reply.data.list,
                    rows = "";
                if(reply.status === "Success") {

                    // -- Writing rows
                    $tBody.empty();
                    for(var n in entities) {
                        if (entities.hasOwnProperty(n)) {
                            var e = entities[n];
                            rows += _row(e, settings);
                        }
                    }
                    $tBody.html(rows);

                    // -- Updating paging
                    setPaging(reply.data.page, reply.data.total, pageSize);

                    // -- Updating sit
                    $elt.attr("data-filter", filter);
                }
            }, self, {}),

            // -- Error callback

            error = new rpApp.Callback(function(params) {
                var reply = params.reply;
                var message = reply.responseJSON; //TODO: fix!
                console.log(message);
                _error($elt, message);
            }, self, {});

        // -- forming url params
        if(order) url += ORDER_BY + order;
        if(orderDirection || orderDirection === 0) url += ORDER_DIR + orderDirection;
        if(filter) url += FILTER + filter;

        service.send(url, "GET", {}, success, error, callback);
    }


    /**
     * Redirects to the entity edit page
     *
     * @param settings are the plugin settings, containing edit url
     */
    function _edit(settings) {
        /*jshint validthis:true */
        var $this = $(this),
            id = $this.attr("data-id"),
            url = settings.url.edit;

        location.href = id? url + id : url;
    }

    /**
     * Handles deleting entity
     *
     * @param e Event object, used for suppressing default behaviour (namely opening edit page)
     */
    function _delete(e) {
        /*jshint validthis:true */
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this),
            $parent = $this.parents("tr"),
            id = $parent.attr("data-id"),
            $table = $this.parents("table"),
            name = $parent.attr("data-entity"),

            // -- Callback object
            callback = new rpApp.Callback(function() {
                var situation = sit($table),
                    orderBy = situation.order.by,
                    orderDirection = situation.order.direction,
                    filter = situation.filter,
                    pageSize = situation.page.size,
                    page = situation.page.current;

                _query.apply($table.get(), [page, pageSize, orderBy, orderDirection, filter]);
            }, self, {});

        methods.remove.apply($table, [id, name, callback]);
    }

    /**
     * Returns current sorting/filtering/paging state. E.g.  {"order":{"by":"","direction":1},"page":{"total":"","current":"1","size":"5"}}
     *
     * @param $tag - table jQuery object
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
        situation.page.size = $pagination.attr("data-page-size");

        return situation;
    }

    /**
     * Returns previous page
     */
    function _previous() {
        /*jshint validthis:true */
        var $table = $(this).parents("table"),
            situation = sit($table),
            orderBy = situation.order.by,
            pageSize = situation.page.size,
            orderDirection = situation.order.direction,
            filter = situation.filter,
            page = --situation.page.current;

        if(page > 0) _query.apply($table.get(), [page, pageSize, orderBy, orderDirection, filter]);
    }

    /**
     * Returns next page
     */
    function _next() {
        /*jshint validthis:true */
        var $table = $(this).parents("table"),
            situation = sit($table),
            orderBy = situation.order.by,
            pageSize = situation.page.size,
            orderDirection = situation.order.direction,
            filter = situation.filter,
            page = ++situation.page.current;

        if(page <= situation.page.total) _query.apply($table.get(), [page, pageSize, orderBy, orderDirection, filter]);
    }

    function _error($elt, message) {
        var settings = _settings($elt),
            $err = $(settings.errSelector.tag);

        $err.find(settings.errSelector.header).html(message.message);
        $err.find(settings.errSelector.message).html(message.error);
        $err.transition(rpApp.constants.messageAnimation);

        window[ERR_GLOBAL] = setTimeout(function() {
            $err.transition(rpApp.constants.messageAnimation);
        }, rpApp.constants.messageDuration);
    }

    /**
     * Returns the list of settings
     *
     * @param $tag - table jQuery object, which contains settings
     */
    function _settings($tag) {
        return JSON.parse($tag.find("tfoot").first().attr("data-settings"));
    }

    /**
     * Sets the current page, and total amount of pages, disables buttons, if there are no previous/next pages
     *
     * @param current - current page
     * @param total - total amount of pages (note: pages, not records)
     * @param pageSize - chosen page size
     */
    function setPaging(current, total, pageSize) {

        var $pagination = $("[data-action=\"pagination\"]"),
            $info = $(".rp-pagination-info"),
            $empty = $(".rp-pagination-empty");

        $pagination.find(".button").removeClass("disabled");
        if(current <= 1) {
            $pagination.find(".rp-previous").addClass("disabled");
        }
        if (current >= total) {
            $pagination.find(".rp-next").addClass("disabled");
        }

        $pagination.attr("data-page-size", pageSize);

        if(total === 0) {
            $info.addClass("rp-invisible");
            $empty.removeClass("rp-invisible");
        } else {
            $info.removeClass("rp-invisible");
            $empty.addClass("rp-invisible");
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
         *
         * @param id - id of the object to be deleted
         * @param name - record name to be displayed on confirmation modal
         * @param callback - callback object to be executed, when deletion is completed
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
                            var reply = params.reply,
                                message = reply.responseJSON,//todo: fix;
                                $table = $elt.parents("table");
                            _error($table, message);
                        }, self, {});

                    service.send(url, "DELETE", {}, success, error, callback);
                });
            });
        },
        /**
         * Displays the paginated list of entities.
         *
         * @param filter Filter applied on entities
         * @param callback Callback function, to be implemented, after server response is returned
         */
        list: function(filter, callback) {
            return this.each(function(){
                var $this = $(this),
                    situation = sit($this),
                    orderBy = situation.order.by,
                    orderDirection = situation.order.direction,
                    pageSize = situation.page.size;

                _query.apply(this, [1, pageSize, orderBy, orderDirection, filter, callback]);
            });
        }
    };

    // -- Defaults

    /**
     * rpTable plugin defaults, which are applied, if no setting defined
     *
     * url.list - url for getting data
     * url.delete - url for deleting data by it's id
     * url.edit - url for opening record in separate window
     * pageSize.default - default page size
     * pageSize.available - the list of available page sizes
     * deletable - defines, if delete column should be shown
     * signature - defines record property to be used as "public" name
     * columns.name - column mapping name
     * columns.title - column title to be shown in header
     * columns.width - column width in percent. If deletable is true, overall width shouldn't be more than 95%
     */
    $.fn.rpTable.defaults = {
        "url": {
            "list": "/",
            "delete": "/",
            "edit": "/"
        },
        "pageSize": {
            "default": PAGE_SIZE,
            "available": [PAGE_SIZE, PAGE_SIZE * 2, PAGE_SIZE * 5]
        },
        "deletable": true,
        "signature": "name",
        "errSelector": {
            "tag": "",
            "header": "",
            "message": ""
        },
        "columns": [
            {
                "name": "name",
                "title": "title",
                "width": "0%",
                "supplementary": {}
            }
        ]
    };

})( jQuery );