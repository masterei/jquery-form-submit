# jquery-form-submit

    An ajax form wrapper plugin to ease form submit event.

[![npm version](https://badge.fury.io/js/@masterei/jquery-form-submit.svg)](https://badge.fury.io/js/@masterei/jquery-form-submit)
![NPM Downloads](https://img.shields.io/npm/dw/@masterei/jquery-form-submit)
![NPM License](https://img.shields.io/npm/l/@masterei/jquery-form-submit)

## Dependencies

This project requires the following dependencies: `jQuery & PNotify`

```html
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<script src="https://unpkg.com/pnotify@3.2.0/dist/pnotify.js"></script>
```

## Installation

### npm
```sh
$ npm i @masterei/query-form-submit
```

### cdn
```html
<script src="https://unpkg.com/@masterei/jquery-form-submit/form-submit.min.js"></script>
```

## Usage

### Basic Usage
```html
<form id="sample-form" method="POST" data-url="/post.php">
    <input type="text" name="sample_input">
</form>

<script>
    $(function(){
        $('form#sample-form').formSubmit();
    });
</script>
```

Note:
1. Server must return an object response with a `message` key value pair. 
```javascript
Eg. ['message' => 'Model has been successfully created.']
```

2. If no response data is being returned, the plugin will use its default messages.

### Option Usage
```javascript
$('form#sample-form').formSubmit({
    url: '/post.php',
    method: 'POST',
    data: new FormData($(this)),
    done: function (){
        // success callback
    },
    fail: function (){
        // failed callback
    },
    always: function (){
        // execute whether success or fail
    },
    ... etc.
}, 1500); 

// 1500 is the default page reload timeout in ms after a successfully request
```

Note: You can freely utilize all the ajax shipped configuration and callback functions.

### Additional Events
```javascript
beforeRequest: function (form){
    // triggered before ajax request is started, allows you to modify the form data
    // accept current element as an argument
    
    // Eg. form.find('input[name="sample_input"]').val('new value');
},
afterRequest: function (form){
    // triggered after request is completed, it executes whether success or fail
    // allows you to modify aftermath form data
}
```

### Default Callbacks

```javascript
done: function (response) {
    options.notify.notifySuccess(response.message);

    // reload page on post request
    if(isMethodPost()){
        setTimeout(function () {
            window.location.reload();
        }, reload);
    }
},
fail: function (error) {
    options.notify.alert.notifyError(error);
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
```

### Automatic method spoofing for media type request

When dealing with restful api, HTML forms do not support `PUT`, `PATCH`, 
or `DELETE` actions. So, when defining these methods that are called from an HTML form, 
you will need to add a hidden `_method` field to the form.

The good news is, the plugin automatically inject this hidden field when it detects 
a form attribute `enctype="multipart/form-data"` included in the form.

Example:
```html
<form id="sample-form" method="POST" data-url="/post.php" enctype="multipart/form-data">
    <input type="file" name="sample_file">
</form>
```

### Tested Compatibility

<ul>
    <li><a href="https://laravel.com/">Laravel</a></li>
</ul>

### Screenshot
![](https://github.com/masterei/jquery-form-submit/blob/main/docs/screenshot-01.png?raw=true)

### Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

### License

The Internet Systems Consortium License (ISC). Please see [License File](LICENSE.md) for 
more information.

### Disclaimer

This plugin was created by the author to address code repetition when developing various 
projects for its clients. So, use at your own risk.
