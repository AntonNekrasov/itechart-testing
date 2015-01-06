/* globals rpApp */
rpApp.admin = {};

/**
 * Handles all the UI events, like pagination, filtering, creating new entities etc. via CRUD object
 * Requires settings to be defined in template. E.g:
 * <div class="hidden" id="settings"
 *     data-list-url="@controllers.admin.routes.TechnologyController.queryTech()"
 *     data-delete-url="@controllers.admin.routes.TechnologyController.removeTech(0).url.dropRight(1)"
 *     data-edit-url="@controllers.admin.routes.TechnologyController.editPage()"
 *     data-cells="name//Name, description//Description"
 *     data-entity-signature="name">
 * </div>
 *
 * data-list-url - url for reading/sorting/filtering data
 * data-delete-url - url for deleting entity
 * data-edit-url - edit/create entity page url
 * data-cells - set of cell names/titles. Cells are divided by "," separator and names & titles are divided by "//" separator
 *    names are used for response mapping, titles are used for naming table cells
 * data-entity-signature - entity property to be used, in order to identify this within the admin
 */



/**
 * TODO: refactor:
 * remove inappropriate information from crud and put it to controller
 */

rpApp.admin.controller = function() {
    var $settings = $("#settings").first(),
        builder = rpApp.builder($settings),
        ASCENDING = "ascending",
        DESCENDING = "descending",
        DESC = 0,
        ASC = 1,
        page = 1,
        pageSize = 10; //TODO: update

    if(!$settings || $settings.length === 0) throw new Error("Unable to find settings tag in template. \n Please, define ");

    // -- Event subscription

    $("#rp-admin-panel")
        .on("click", "[data-action=\"editPage\"]", function() {_edit.apply(this, [])})
        .on("click", "[data-action=\"delete\"]", function(e) {_delete.apply(this, [e])})
        .on("click", ".sortable.table thead th", function() {_sort.apply(this, [])})
        .on("keyup", "[data-action=\"search\"]", function() {_filter.apply(this, [])});

    // -- Event handlers

    /**
     * Handlers sorting
     */
    function _sort() {
        var $this = $(this),
            orderBy = $this.attr("data-map"),
            $th = $(".sortable.table thead th"),
            filter = $("[data-action=\"search\"]").first().val(),
            asc = $this.hasClass(ASCENDING),
            callback = new rpApp.Callback(function(){
                $th.removeClass("sorted").removeClass(ASCENDING).removeClass(DESCENDING);
                $this.addClass("sorted");
                $this.addClass((asc ? DESCENDING : ASCENDING));
            }, self, {});

        builder.query(page, pageSize, orderBy, asc ? 0 : 1, filter, callback);
    }

    /**
     * Handles filtering data
     */
    function _filter(){
        var $this = $(this);
        clearTimeout(window["rp-search"]);
        window["rp-search"] = setTimeout(function() {
            var $loading = $this.parent().addClass("loading"),
                situation = sit(),
                orderBy = situation.order.by,
                orderDirection = situation.order.direction,
                callback = new rpApp.Callback(function(){
                    $loading.removeClass("loading");
                }, self, {});

            builder.query(1, pageSize, orderBy, orderDirection, $this.val(), callback);
        }, 1000);
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
            name = $parent.attr("data-entity"),
            callback = new rpApp.Callback(function() {
                var situation = sit(),
                    orderBy = situation.order.by,
                    orderDirection = situation.order.direction,
                    filter = situation.filter;
                builder.query(page, pageSize, orderBy, orderDirection, filter);
            }, self, {});

        builder.remove(id, name, callback);
    }

    /**
     * Redirects to the entity create/edit page
     */
    function _edit() {
        var $this = $(this),
            id = $this.attr("data-id"),
            url = $settings.attr("data-edit-url");
        builder.editPage(url, id);
    }

    // -- Private functions

    /**
     * Returns current sorting/filtering
     */
    function sit() {
        var $th = $(".sortable.table thead th"),
            $sorted = $th.filter(".sorted"),
            situation = {};

        situation.filter = $("[data-action=\"search\"]").first().val();
        situation.order = {};
        situation.order.by = $sorted.length > 0 ? $sorted.attr("data-map") : "";
        if($sorted.length > 0 && $sorted.hasClass(DESCENDING)) {
            situation.order.direction = DESC;
        } else {
            situation.order.direction = ASC;
        }
        return situation;
    }

    // -- Init section

    builder.query(page, pageSize);
};

