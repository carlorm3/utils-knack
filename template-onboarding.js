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

        /**
         * Render scene on library
         * @param {string} title - The title of the task you're going to create, you can put anything here, this is a free text field.
         * @param {string} scene - The scene you want to add a listener, should be in the format knack-page-render.scene_x.
         */
        lib.addTask('renderScene', 'knack-page-render.scene_1', function (e,v) {

        });

        /**
         * Render view on library
         * @param {string} title - The title of the task you're going to create, you can put anything here, this is a free text field.
         * @param {string} view - The scene you want to add a listener, should be in the format knack-view-render.view_x
         */
        lib.addTask('renderView', 'knack-view-render.view_1', function (e, v) {

        });


        /**
         * Create method on library
         * @param {string} objectId - The id of the Knack object (check the URL on the builder)
         * @param {object} payload - The payload for the create request, should be like {field_1:"developers"}
         */
        //new_object = await lib.create('object_xx',JSON.stringify(payload));


        /**
          * Update method on library
          * @param {string} objectId - The id of the Knack object (check the URL on the builder)
          * @param {string} recordId - The id of the Knack record you want to update
          * @param {object} payload - The payload for the update request, should be like {field_1:"developers"}
        */
        //updated_object = await lib.update('object_xx','id_object',JSON.stringify(payload));
         
        /**
         * Delete method on library
         * @param {string} objectId - The id of the Knack object (check the URL on the builder)
         * @param {string} recordId - The id of the Knack record you want to delete
         */
        //deleted_object = await lib.delete('object_xx','id_object');

        /**
         * Find many records on library
          * @param {string} objectId - The id of the Knack object (check the URL on the builder)
          * @param {[object]} filters - Array of filters to query the Knack database https://docs.knack.com/docs/constructing-filters
         */
        //objects = await lib.find('object_xx',[{field: 'field_xx',operator:'is',value: 'field_value'}]);

        /**
         * Find one record using the knack id on library
         * @param {string} objectId - The id of the Knack object (check the URL on the builder)
         * @param {string} recordId - The id of the Knack record you want to get
        */
        //object = await lib.findById('object_xx','id_object');

        

        //grab form logic for exercise 1
        lib.addTask('renderView', 'knack-view-render.view_xx', function (e, v) {
            var form = $('#view_xx form');
            var button = form.find('button:submit');
            button.click( function(e) {
                e.preventDefault();
            });
        });

        callback();
    });
};
