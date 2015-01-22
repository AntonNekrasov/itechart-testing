/**
 * jQuery table plugin
 */
(function($){
    "use strict";

    // -- Init

    $.fn.rpTable = function( method, callback ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.rpTable' );
            return null;
        }
    };

    // -- Render

    function render(tag) {

    }

    // -- Subscription

    function subscribe(tag) {

    }

    // -- Private functions

    function settings(){

    }

    function sort(){

    }

    // -- Public methods definitions

    var methods = {
        init: function( options, callback ) {
            var self = this;
            self.settings = $.extend({}, $.fn.rpTable.defaults, options);
            return this.each(function(){
                var $this = $(this);



            });
        },
        myMethod: function(options, callback) {
            self.settings = $.extend({}, $.fn.itechartPlugin.defaults, options);
            return this.each(function(){
                //my code
            });
        }
    };

    // -- Defaults

    $.fn.rpTable.defaults = {
        //"color": "red"
    }

})(jQuery);