KnackInitAsync = function ($, callback) {

    window.$ = $;
  	window.LazyLoad = LazyLoad;
    LazyLoad.js(['https://s3.amazonaws.com/soluntech-www/KnackJS/knack-proxy-lib.js'], function () {

        var lib = new Soluntech({
         applicationID: 'generated_id_proxy',
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

        });

        lib.addTask('inlineEdit', 'knack-cell-update.view_1', function (e, v) {

        })

        lib.addTask('deleteTableOrList', 'knack-record-delete.view_1', function (e, v) {

        })

        //chartjs,async,moment...
        lib.loadLibrary('libraryName', function () {

        });

        //grab form
        lib.addTask('renderView', 'knack-view-render.view_1083', function (e, v) {
            var form = $('#view_1083 form');
            var button = form.find('button:submit');
            button.click( function(e) {
                e.preventDefault();
                lib.showErrorMessage('view_1083','The quantity received cannot be higher than '+totalRemaining);
                lib.removeMessages('view_1083');
                form.submit();
            });
        });

        //error messages
        lib.addMethod('removeMessages', function (view) {

            $('#' + view + ' form .is-error').remove();
            $('#' + view + ' .success').remove();
        });

        lib.addMethod('showErrorMessage', function (view, text) {

            lib.removeMessages(view);

            $('#' + view + ' form').prepend(
                $('<div>')
                .addClass('kn-message is-error')
                .append(
                    $('<span>')
                    .addClass('kn-message-body')
                    .append(
                        $('<p>')
                        .append(
                            $('<strong>').text(text)
                        )
                    )
                )
            );
        });

        //general error redirect login
        var LOGIN_PAGE = false;
        var LOGIN = false;

        lib.addTask('Log Redirect Home', 'knack-scene-render.any', function(event, scene) {

            LOGIN_PAGE = ($('.kn-login').length == 1) ? true : false;
            if (LOGIN_PAGE) {
                LOGIN = false;
                if(Knack.getUserAttributes() === "No user found"){
                    $('input[type="submit"]').click(function (e) {

                        e.preventDefault();
                        LOGIN = true;

                        $('form').submit();
                    });
                }else{
                    // redirect to
                    window.open(Knack.url_base+'#welcome-login',"_self")
                }

            } else {
                if (LOGIN) {
                    LOGIN = false;

                    // redirect to
                    window.open(Knack.url_base+'#welcome-login',"_self")
                }
            }
        });

        lib.addTask('loop a knack table', 'knack-view-render.view_2937', function (e, v,data) {
            for(invoice of data){
                if(invoice.field_1496_raw && invoice.field_1496_raw[0] && invoice.field_1496_raw[0].id){
                    let trRow = $(`#${v.key} tr#${invoice.id}`)
                    trRow.append('<a class="kn-link-page" href="https://headofsecurity.knack.com/the-hs3-platform-w-records-and-tasks#service-requests/view-service-details3/'+invoice.field_1496_raw[0].id+'/"><i class="icon-hs3">a</i>VIEW DETAILS</a>');
                    // $('#view_2937 tr#'+invoice.id+' .field_1496 span').html('<a href="https://headofsecurity.knack.com/the-hs3-platform-w-records-and-tasks#service-requests/view-service-details3/'+invoice.field_1496_raw[0].id+'/">'+invoice.field_1496+'</a>')
                }
            }
        });

        callback();
    });
};
