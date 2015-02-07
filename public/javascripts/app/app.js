$(document).ready(function() {

    var ajaxCounter = 0,
        $loader = $("#rp-admin-content").find(".progress");

    // -- shows loading indicator

    $.ajaxSetup({
        error : function() {
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

}).on("rp-alert", function(event, alert) {

    var id = Number.parseInt(Math.random() * 100000),
        $flash = $("<div id=\"" + id + "\" class=\"ui " + alert.type + " message hidden rp-flash\"> " +
            "<i class=\"close icon\"></i>" +
            "<div class=\"header\">" +
                alert.title +
            "</div>" +
            "<p>" + alert.message + "</p>" +
        "</div>"),
        transition = {
            "animation": rpApp.constants.messageAnimation,
            "onComplete": function() {
                $flash.remove();
            }
        },
        $alertContainer = $(".rp-alert-container");

    $flash.on("click", ".close", function() {
        $flash.transition(transition);
        clearTimeout(window["rp-flash-" + id]);
    });

    $alertContainer.append($flash);
    $flash.transition(rpApp.constants.messageAnimation);

    window["rp-flash-" + id] = setTimeout(function() {
        $flash.transition(transition);
    }, rpApp.constants.messageDuration);

});


