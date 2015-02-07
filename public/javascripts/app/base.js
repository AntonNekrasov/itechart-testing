/**
 * A set of base tools for further development
 * rpApp - is global object, which contains client side business logic
 */

var rpApp = {};

/**
 * Constants
 *
 * messageDuration - duration of the message
 * messageAnimation - animation effect
 */
rpApp.constants = {
    "messageDuration": 8000,
    "messageAnimation": "drop"
};

/**
 * Callback object, is function to be called after main operation happens
 *
 * @param fn - function to be executed
 * @param scope - context in which function given is to be executed
 * @param parameters - a set of argument passed to the function
 */
rpApp.Callback = function Callback(fn, scope, parameters){
    this.fn = fn;
    this.scope = scope;
    this.parameters = parameters;
};

/**
 * Alert object contains data, used for flashing messages
 *
 * @param title - the title of the alert
 * @param message - alert message
 * @param type - message type
 */
rpApp.Alert = function Alert(title, message, type) {
    this.title = title;
    this.message = message;
    this.type = type;
};

/**
 * Model service which sends ajax calls to web services and applies callbacks, depending on return status
 *
 * see send method's signature
 */
rpApp.Service = (function () {

    /**
     * Callback object, is function to be called after main operation happens
     *
     * @param url - url address of the web service
     * @param method - http method type
     * @param data - data to be send within the request
     * @param success - callback object to be launched right after successful response is returned
     * @param error - callback object to be launched right after error response is returned
     * @param  callback - callback object to be launched right after response is returned, no matter successful or not
     */
    var send = function(url, method, data, success, error, callback) {
        var params = {};

        jQuery.ajax({
            url: url,
            method: method,
            data: data
        }).done(function(s) {
            if(success) {
                params = success.parameters;
                if(s) params.reply = s;
                success.fn.apply(success.scope, [params]);
            }
        }).fail(function(e) {
            if(error) {
                params = error.parameters;
                if(e) params.reply = e;
                error.fn.apply(error.scope, [params]);
            }
        }).always(function(c) {
            if(callback) {
                params = callback.parameters;
                if(c) params.reply = c;
                callback.fn.apply(callback.scope, [params]);
            }
        });
    };

    // -- Public api

    return {
        send: send
    }
})();

