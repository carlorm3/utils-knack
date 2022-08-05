KnackInitAsync = function ($, callback) {

    window.$ = $;
  	window.LazyLoad = LazyLoad;
    LazyLoad.js(['https://s3.amazonaws.com/soluntech-www/KnackJS/soluntech-knack-lib-min.js'], function () {

        var lib = new Soluntech({
            applicationID: atob(atob('api_id_hash')), //REPLACE THIS HASH USING THE WEBPAGE
            restAPIkey: atob(atob('api_key_hash')), //REPLACE THIS HASH USING THE WEBPAGE
            environment: 'development'
        });

        lib.set('OBJECTS_ID', {
            order: 'object_x',
            orderDetail: 'object_x' 
        });

        lib.addTask('renderScene', 'knack-page-render.scene_1', function (e,v) {

        });

        lib.addTask('renderView', 'knack-view-render.view_1', function (e, v) {

        });


        //grab form
        lib.addTask('renderView', 'knack-view-render.view_1083', function (e, v) {
            var form = $('#view_1083 form');
            var button = form.find('button:submit');
            button.click( function(e) {
                e.preventDefault();
                lib.showErrorMessage('view_1083','The quantity received cannot be higher than '+totalRemaining);
                lib.removeMessages('view_1083');
                $('html, body').animate({
                scrollTop: $("#view_1083").offset().top
                }, 1000);
                form.submit();
            });
        });

        callback();
    });
};
