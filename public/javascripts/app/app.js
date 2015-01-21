$(document).ready(function() {
    var transition = "drop";
    $(".rp-flash").transition(transition);

    $("body").on("click", ".rp-flash .close", function() {
        $(this).parents(".rp-flash").transition(transition);
        clearTimeout(window["rp-flash-delay"]);
    });

    window["rp-flash-delay"] = setTimeout(function(){
        $(".rp-flash").transition(transition);
    }, 8000);

    rpApp.admin.controller();
});


