
// todo: generalize error messaging (use triggering events and passing messages)
$(document).ready(function() {

    $(".rp-flash").transition(rpApp.constants.messageAnimation);

    $("body").on("click", ".rp-flash .close", function() {
        $(this).parents(".rp-flash").transition(rpApp.constants.messageAnimation);
        clearTimeout(window["rp-flash-delay"]);
    });

    window["rp-flash-delay"] = setTimeout(function(){
        $(".rp-flash").transition(rpApp.constants.messageAnimation);
    }, rpApp.constants.messageDuration);
});


