
// todo: generalize error messaging (use triggering events and passing messages)
$(document).ready(function() {

    var ajaxCounter = 0,
        $loader = $("#rp-admin-content .progress");

    $(".rp-flash").transition(rpApp.constants.messageAnimation);

    $("body").on("click", ".rp-flash .close", function() {
        $(this).parents(".rp-flash").transition(rpApp.constants.messageAnimation);
        clearTimeout(window["rp-flash-delay"]);
    });

    window["rp-flash-delay"] = setTimeout(function(){
        $(".rp-flash").transition(rpApp.constants.messageAnimation);
    }, rpApp.constants.messageDuration);

    $.ajaxSetup({
        error : function(jqXHR, textStatus, errorThrown) {
            --ajaxCounter;
            if(!ajaxCounter) {
                $loader.css("visibility", "hidden");
            }
        },
        beforeSend : function() {
            ++ajaxCounter;
            if(ajaxCounter) {
                $loader.css("visibility", "visible");
            }
        },
        complete : function() {
            --ajaxCounter;
            if(!ajaxCounter) {
                $loader.css("visibility", "hidden");
            }
        }
    });

});


