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
 * remove inappropriate information from controller and put it to rpTable
 */

rpApp.admin.controller = function() {
    var $settings = $("#settings").first(),
        settings = {
            "url": {
                "list": $settings.attr("data-list-url"),
                "delete": $settings.attr("data-delete-url"),
                "edit": $settings.attr("data-edit-url")
            },
            pageSize: 5,//TODO: generalize
            "deletable": true,
            "signature": $settings.attr("data-entity-signature"),
            "columns": columns()
        },
        $table = $(".rp-table").rpTable(settings);

    if(!$settings || $settings.length === 0) throw new Error("Unable to find settings tag in template. \n Please, define ");

    // -- Event subscription

    $("#rp-admin-content")
        .on("click", "[data-action=\"createPage\"]", function() {_create.apply(this, [])})
        .on("keyup", "[data-action=\"search\"]", function() {_filter.apply(this, [])});

    /**
     * Handles filtering data
     */
    function _filter() {
        var $this = $(this);
        clearTimeout(window["rp-search"]);
        window["rp-search"] = setTimeout(function() {
            var $loading = $this.parent().addClass("loading"),
                callback = new rpApp.Callback(function(){
                    $loading.removeClass("loading");
                }, self, {});

            //TODO: fix this;!
            //$table.rpTable("query", 1, pageSize, orderBy, orderDirection, $this.val(), callback);
            $table.rpTable("list", $this.val(), callback);
        }, 1000);
    }

    /**
     * Redirects to the entity create/edit page
     *
     */
    function _create() {
        location.href = settings.url.edit;
    }

    /**
     * Prepares the list of table cells for the specific page. Requires settings tag to be defined.
     */
    function columns() {
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
                "title": cell.substring(sepIndex + SEPARATOR2.length),
                "width": 0 // TODO: add handler;
            });
        }
        return result;
    }

    // -- Init section

    $table.rpTable("list");
};