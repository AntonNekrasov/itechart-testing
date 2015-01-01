/* globals rpApp */
rpApp.admin = {};

/**
 * Handles all the UI events, like pagination, filtering, creating new entities etc. via CRUD object
 * Requires settings to be defined in template. E.g:
 * <div class="hidden" id="settings"
 *     data-list-url="@controllers.admin.routes.TechnologyController.queryTech()"
 *     data-delete-url="@controllers.admin.routes.TechnologyController.removeTech(0).url.dropRight(1)"
 *     data-edit-url="@controllers.admin.routes.TechnologyController.editPage()"
 *     data-cells="name//Name, description//Description">
 * </div>
 *
 * data-list-url - url for reading/sorting/filtering data
 * data-delete-url - url for deleting entity
 * data-edit-url - edit/create entity page url
 * data-cells - set of cell names/titles. Cells are divided by "," separator and names & titles are divided by "//" separator
 *    names are used for response mapping, titles are used for naming table cells
 */

rpApp.admin.controller = function() {
    var $settings = $("#settings").first(),
        crud = rpApp.Crud($settings);

    if(!$settings || $settings.length === 0) throw new Error("Unable to find settings tag in template. \n Please, define ")

    // -- Event handlers

    $("#rp-admin-panel").on("click", "[data-action=\"editPage\"]", function() {
        var $this = $(this),
            id = $this.attr("data-id"),
            url = $settings.attr("data-edit-url");
        crud.editPage(url, id);
    }).on("click", "[data-action=\"delete\"]", function(e) {
        e.preventDefault();
        e.stopPropagation();

        // TODO: update;
        alert("delete");
    });

    crud.query();

};

