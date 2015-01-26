$(document).ready(function() {
    var transition = "drop",
        DELAY = 8000;
    $(".rp-flash").transition(transition);

    $("body").on("click", ".rp-flash .close", function() {
        $(this).parents(".rp-flash").transition(transition);
        clearTimeout(window["rp-flash-delay"]);
    });

    window["rp-flash-delay"] = setTimeout(function(){
        $(".rp-flash").transition(transition);
    }, DELAY);

    // -- Launches
    rpApp.admin.controller();
});


