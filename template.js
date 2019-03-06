KnackInitAsync = function ($, callback) {

    window.$ = $;
  	window.LazyLoad = LazyLoad;
    LazyLoad.js(['https://s3.amazonaws.com/soluntech-www/KnackJS/soluntech-knack-lib-min.js'], function () {

        var lib = new Soluntech({
            applicationID: 'api_id',
            restAPIkey: 'api_key',
            environment: 'development'
        });

        lib.set('OBJECTS_ID', {
            user: 'object_1',
        });

        lib.addMethod('handleError', function (err) {

            var str = typeof err === 'string' ? err : err.message;

            if (!str) {
                str = 'Internal error, please consult your administrator';
            }
            lib.hideSpinner()
            alert(str);
        });

        lib.addTask('renderScene', 'knack-page-render.scene_1', function (e,v) {

        });

        lib.addTask('formSubmit', 'knack-form-submit.view_1', function (e,v,object) {

        });

        lib.addTask('renderView', 'knack-view-render.view_1', function (e, v) {


        callback();
    });
};
