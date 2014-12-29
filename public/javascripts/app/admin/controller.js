/* globals rpApp */
rpApp.admin = {}

rpApp.admin.controller = function() {
    var self = this,
        service = rpApp.Service,
        list = (function () {
            var me = $("[data-action='list']"),
                query = function() {
                    me.each(function() {
                        var $elt = $(this),
                            url = $elt.attr("data-url"),
                            success = new rpApp.Callback(function(params){
                                //reply = params.reply;
                                //if(reply.status === "SUCCESS") {
                                //    books([]);
                                //    totalPages(reply.data.totalPages);
                                //    for(var i = 0, lth = reply.data.list.length; i < lth; i++) {
                                //        var book = reply.data.list[i];
                                //        addBook(book.id, book.name, book.price);
                                //    }
                                //}
                                alert("success");
                            }, self, {}),
                            error = new rpApp.Callback(function(params){
                                    //reply = params.reply;
                                    //var message = reply.responseText ? reply.responseText : reply.statusText;
                                    //alert(message);
                                    alert("error");
                                }, self, {}
                            );



                        $elt.empty();


                        service.send(
                            url,
                            "GET",
                            {},
                            function() {success},
                            function() {error}

                        )
                    });
                    //var url = me.attr("data-url");

                }
            return {
                query: query
            }
        })();

    list.query();


};

