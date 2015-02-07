/* globals rpApp */
rpApp.admin = {};

/**
 * Handles all the UI events, like pagination, filtering, creating new entities etc. via CRUD object
 * Requires settings to be defined in template. E.g:
 * <div class="hidden" id="settings"
 *     data-list-url="@controllers.admin.routes.TechnologyController.queryTech()"
 *     data-delete-url="@controllers.admin.routes.TechnologyController.removeTech(0).url.dropRight(1)"
 *     data-edit-url="@controllers.admin.routes.TechnologyController.editPage()"
 *     data-create-url="@controllers.admin.routes.TechnologyController.createPage()"
 *     data-cells="name//Name//85, description//Description//10"
 *     data-supplementary="updated//description//@Messages("general.name")"
 *     data-entity-signature="name">
 * </div>
 *
 * data-list-url - url for reading/sorting/filtering data
 * data-delete-url - url for deleting entity
 * data-edit-url - edit/create entity page url
 * data-cells - set of cell names/titles/width in percent. Cells are divided by "," separator and names, titles & widths are divided by "//" separator
 *    names are used for response mapping, titles are used for naming table cells, and widths are used for defining cell width
 * data-supplementary - shows supplementary information for cell specified. The first value is the data itself, the second value is
 *    mapped cell, and the third is label (title) to be displayed
 * data-entity-signature - entity property to be used, in order to identify this within the admin
 */
rpApp.admin.controller = (function() {
    var $settings = $("#settings").first(),
        PAGE_SIZE = 5,
        settings = {
            "url": {
                "list": $settings.attr("data-list-url"),
                "delete": $settings.attr("data-delete-url"),
                "edit": $settings.attr("data-edit-url"),
            },
            pageSize: {
                "default": PAGE_SIZE,
                "available": [PAGE_SIZE, PAGE_SIZE * 2, PAGE_SIZE * 5]
            },
            "deletable": true,
            "signature": $settings.attr("data-entity-signature"),
            "columns": columns()
        },
        $table = $(".rp-table").rpTable(settings),
        DELAY = 1000;

    if(!$settings || $settings.length === 0) throw new Error("Unable to find settings tag in template. \n Please, define ");

    // -- Event subscription

    $("#rp-admin-content")
        .on("click", "[data-action=\"createPage\"]", function() {_create.apply(this, []);})
        .on("keyup", "[data-action=\"search\"]", function() {_filter.apply(this, []);});

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

            $table.rpTable("list", $this.val(), callback);
        }, DELAY);
    }

    /**
     * Redirects to the entity create/edit page
     *
     */
    function _create() {
        location.href = $settings.attr("data-create-url");
    }

    /**
     * Prepares the list of table cells for the specific page. Requires settings tag to be defined.
     */
    function columns() {
        var dataCells = $settings.attr("data-cells"),
            dataSupplementaryCells = $settings.attr("data-supplementary"),
            SEPARATOR1 = ",",
            SEPARATOR2 = "//",
            result = [];

        if(!dataCells) throw new Error("Table cells are not specified in template settings!");

        // -- getting the list of columns
        var cellsArr = dataCells.split(SEPARATOR1);
        for(var i = 0, lth1 = cellsArr.length; i < lth1; i++ ) {
            var cell = cellsArr[i].trim(),
                cellDetailsArr = cell.split(SEPARATOR2);

            result.push({
                "name": cellDetailsArr[0],
                "title": cellDetailsArr[1],
                "width": cellDetailsArr[2],
                "supplementary": {}
            });
        }

        // -- getting meta information (supplementary data)
        if(dataSupplementaryCells) {
            var supplementaryCellsArr = dataSupplementaryCells.split(SEPARATOR1);
            for(var j = 0, lth2 = supplementaryCellsArr.length; j < lth2; j++ ) {
                var supplementaryCell = supplementaryCellsArr[j].trim(),
                    supplementaryDetailsArr = supplementaryCell.split(SEPARATOR2),
                    mapped = supplementaryDetailsArr[1],
                    matching = getMatchingColumn(mapped),
                    supplementary = {
                        "value": supplementaryDetailsArr[0],
                        "title": messages(supplementaryDetailsArr[2])
                    };
                if(matching >= 0) {
                    result[matching].supplementary = supplementary;
                }

            }
        }

        function getMatchingColumn(mapped) {
            for(var k = 0, lth3 = result.length; k < lth3; k ++) {
                if(result[k].name === mapped) {
                    return k;
                }
            }
            return -1;
        }

        return result;
    }

    // -- Init section

    $table.rpTable("list");
})();