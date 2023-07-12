/*
jquery-form-submit v1.0.1
https://github.com/masterei/jquery-form-submit
Copyright (c) Masterei <mastereijunior@gmail.com>
The Internet Systems Consortium License (ISC)
*/
$(function () {
    $.fn.extend({
        formSubmit: function (options = {}, reload = 1500){
            let form = $(this);

            /**
             * Event handlers
             * @required Form object.
             */
            options = $.extend({
                notify: {
                    success: function (message, title = 'Success!'){
                        new PNotify({
                            title: title,
                            text: message,
                            addclass: 'alert alert-styled-right alert-arrow-right',
                            type: 'success'
                        });
                    },
                    error: function (message, title = 'Error!'){
                        // object type data
                        if(message.hasOwnProperty('responseJSON')){

                            if(message.responseJSON.hasOwnProperty('errors')){
                                for (let key in message.responseJSON.errors) {
                                    message = message.responseJSON.errors[key][0];
                                    break;
                                }
                            } else if(message.responseJSON.hasOwnProperty('message')){
                                message = message.responseJSON.message;
                            }

                        } else if(message.hasOwnProperty('message')) {
                            message = message.message;
                        }

                        new PNotify({
                            title: title,
                            text: message,
                            addclass: 'alert alert-styled-right alert-arrow-right',
                            type: 'error'
                        });
                    }
                },
                beforeRequest: function (form){
                    // execute before ajax request
                    // used current object element to manipulate data
                },
                afterRequest: function (form){
                    // execute after ajax response
                    // used current object element to manipulate data
                }
            }, options);

            // check if form contains file to be uploaded
            const isEnctypeMultipart = function (){
                return (typeof options.enctype !== 'undefined' && options.enctype === 'multipart/form-data')
                    || (typeof form.attr('enctype') !== 'undefined' && form.attr('enctype') === 'multipart/form-data');
            }

            // url for ajax request
            const requestEndpoint = function (){
                return form.attr('action');
            }

            // method for ajax request
            const requestMethod = function (){
                // automatically return 'POST' method if it is multipart/form-data
                return (typeof form.attr('method') !== 'undefined'
                    && form.attr('method') !== false)
                && !isEnctypeMultipart()
                    ? form.attr('method')
                    : 'POST';
            }

            // build request data for ajax request
            const requestData = function (){
                let data = isEnctypeMultipart()
                    ? new FormData(form[0])
                    : form.serialize();

                // insert method spoofing on multipart/form-data
                if(isEnctypeMultipart()){
                    data.append('_method', getActualMethod());
                }

                return data;
            }

            // prepare, merge default and user define configs
            const requestConfigs = function (){
                let default_configs = {
                    url: requestEndpoint(),
                    method: requestMethod(),
                    data: requestData(),
                    done: function (response) {
                        options.notify.success(response.message);

                        // reload page on post request
                        if(isMethodPost()){
                            setTimeout(function () {
                                window.location.reload();
                            }, reload);
                        }
                    },
                    fail: function (error) {
                        options.notify.error(error);
                    },
                    always: function (xhr) {
                        /**
                         * Remove disabled property only if an error occurred
                         * in a post request or if action is a patch or put
                         */
                        if((xhr.status !== undefined && isMethodPost())
                            || (isMethodPatch() || isMethodPut())) {
                            form.find('button[type="submit"]').prop('disabled', false);
                        }
                    }
                };

                // additional config if form request has files included
                let multipart_config = {
                    processData:false,
                    contentType: false,
                    cache: false
                }

                default_configs = isEnctypeMultipart() ? $.extend(multipart_config, default_configs) : default_configs;

                return $.extend(default_configs, options);
            }

            // get actual method used in request
            // endpoint method spoofing is included in detection
            // spoofing method is applicable on multipart/form-data
            const getActualMethod = function (){
                return (typeof form.attr('method') !== 'undefined' && form.attr('method') !== false)
                    ? form.attr('method')
                    : 'POST';
            }

            // check if endpoint is post
            const isMethodPost = function (){
                return getActualMethod().toLowerCase() === 'post';
            }

            // check if endpoint is patch
            const isMethodPatch = function (){
                return getActualMethod().toLowerCase() === 'patch';
            }

            // check if endpoint is put
            const isMethodPut = function (){
                return getActualMethod().toLowerCase() === 'put';
            }

            // form submit event
            form.submit(function (e){
                // let that = ;
                e.preventDefault();

                // manipulating form data before request goes here
                options.beforeRequest(form);

                let configs = requestConfigs();

                // disable submit button
                $(this).find('button[type="submit"]').prop('disabled', true);

                // execute ajax request
                $.ajax(configs)
                    .done(function (response) {
                        configs.done(response);
                    }).fail(function (error) {
                        configs.fail(error);
                    }).always(function (xhr) {
                        // enable submit button
                        configs.always(xhr);

                        // executed after ajax response
                        options.afterRequest(form);
                    });
            });

            return this;
        }
    });
});
