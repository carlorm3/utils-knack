/*
    Soluntech Library to Knack applications

    Luis Miguel Bula Mora <bulaluis@gmail.com>

    Soluntech - 2017
    www.soluntech.com
*/
var Soluntech = function (info) {

    // Knack info
    this.applicationID = info.applicationID;
    this.restAPIkey = info.restAPIkey;
    this.knackURL = info.knackURL || 'https://api.knack.com/v1/';
    this.jQuery = info.jQuery || window.$;

    // Environment info
    this.environment = info.environment || 'production';
    this.isProduction = this.environment === 'production';
    this.isDevelopment = this.environment === 'development';

    // Internal info
    this.$spinnerBackdrop = null;

    // External libraries
    this.libraries = info.libraries || {
        moment: {
            url: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js',
            loaded: false,
            objectName: 'moment'
        },
        async: {
            url: 'https://cdnjs.cloudflare.com/ajax/libs/async/2.4.1/async.min.js',
            loaded: false,
            objectName: 'async'
        },
        jquery: {
            url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js',
            loaded: false,
            objectName: 'jQuery'
        },
        idleTimer: {
            url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-idletimer/1.0.0/idle-timer.min.js',
            loaded: false,
            objectName: 'idleTimer'
        },
        chartjs: {
            url: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js',
            loaded: false,
            objectName: 'chartjs'
        }
    };

    // Check compatibility
    this.assert(Knack || window.Knack, 'Error, this library only run on Knack applications');
    this.assert(this.jQuery, 'Error, jQuery instance is required');
};

Object.defineProperty(Soluntech.prototype, '$', {
    get: function () {

        return window.jQuery || this.jQuery || window.$;
    }
});

Soluntech.prototype.set = function (key, value) {

    Object.defineProperty(Soluntech.prototype, key, {
        get: function () {

            return value;
        }
    });
};

Soluntech.prototype.log = function () {

    var args = Array.prototype.slice.call(arguments);
    if (console && typeof (console.log) === 'function' && this.isDevelopment) {
        console.log.apply(console, args);
    }
};

Soluntech.prototype.warn = function () {

    var args = Array.prototype.slice.call(arguments);
    if (console && typeof (console.warn) === 'function' && this.isDevelopment) {
        console.warn.apply(console, args);
    }
};

Soluntech.prototype.error = function () {

    var args = Array.prototype.slice.call(arguments);
    if (console && typeof (console.error) === 'function' && this.isDevelopment) {
        console.error.apply(console, args);
    }
};

Soluntech.prototype.debug = function () {

    var args = Array.prototype.slice.call(arguments);
    if (console && typeof (console.debug) === 'function' && this.isDevelopment) {
        console.debug.apply(console, args);
    }
};

Soluntech.prototype.assert = function (cond, message) {

    if (!cond) {
        throw new Error(message);
    }
};

Object.defineProperty(Soluntech.prototype, 'headers', {
    get: function () {

        return {
            'X-Knack-Application-ID': this.applicationID,
            'X-Knack-REST-API-Key': this.restAPIkey,
            'content-type': 'application/json'
        };
    }
});

Soluntech.prototype.next = function (tick) {

    setTimeout(function () { tick() }, 0);
};

Soluntech.prototype.showSpinner = function (callback) {

    if (this.$spinnerBackdrop) {
        return;
    }

    this.$spinnerBackdrop = this.$(
        '<div style="z-index: 100000; position: absolute; top: 0; left: 0; right: 0; bottom: 0;">' +
        '</div>'
    );
    this.$spinnerBackdrop.appendTo('body');

    // wait for next tick
    this.next(function () {

        Knack.showSpinner();

        if (typeof callback === 'function') {
            callback();
        }
    });
};

Soluntech.prototype.hideSpinner = function (callback) {

    if (this.$spinnerBackdrop) {
        this.$spinnerBackdrop.remove();
        this.$spinnerBackdrop = null;
    }

    this.next(function () {

        Knack.hideSpinner();

        if (typeof callback === 'function') {
            callback();
        }
    });
};

Soluntech.prototype.load = function (libs, callback) {

    var self = this;

    LazyLoad.js(libs, function () {

        callback.call(self);
    });
};

Soluntech.prototype.loadLibrary = function () {

    var args = Array.prototype.slice.call(arguments);
    var callback = args.pop();
    var libs = [];
    var _library;
    var self = this;

    args.forEach(function (library) {

        _library = self.libraries[library];

        if (_library && !_library.loaded) {
            _library.loaded = true;
            libs.push(_library.url);
        }
    });

    if (!libs.length) {
        return callback.call(this);
    }

    this.load(libs, callback);
};

Soluntech.prototype.libraryIsLoaded = function (libraryName) {

    var library = this.libraries[libraryName];

    if (!library) {
        return false;
    }

    return library.loaded;
};

Soluntech.prototype.insertLibrary = function (libraryName, url) {

    var library = this.libraries[libraryName];

    if (library) {
        return;
    }

    this.libraries[libraryName] = {
        url: url,
        loaded: false
    };
};

Soluntech.prototype.addTask = function (desc, event, task) {

    this.$(document).on(event, task.bind(this));
};

Soluntech.prototype.addMethod = function (name, func) {

    Object.defineProperty(Soluntech.prototype, name, {
        get: function () {

            return func.bind(this);
        }
    });
};

Soluntech.prototype.librariesRequired = function () {

    var args = Array.prototype.slice.call(arguments);
    var self = this;
    var library;

    args.forEach(function (libraryName) {

        library = self.libraries[libraryName];

        self.assert(library, 'Library "' + libraryName + '" don\' exists');
        self.assert(window[library.objectName], 'Library "' + libraryName + '" is required');
    });
};

Soluntech.prototype.find = function (objectId, filters, sortField, sortOrder, recordPerPage) {

    filters = filters || [];
    sortOrder = sortOrder || '';
    sortField = sortField || '';
    recordPerPage = recordPerPage || 'all';

    var filterValEnc = encodeURIComponent(JSON.stringify(filters));
    var sortFEnc = encodeURIComponent(sortField);
    var sortOEnc = encodeURIComponent(sortOrder);

    var dfd = $.Deferred();

    $.ajax({
        type: 'GET',
        headers: this.headers,
        url: this.knackURL + 'objects/' + objectId + '/records?rows_per_page=' + recordPerPage +
            '&filters=' + filterValEnc + "&sort_field=" + sortFEnc + "&sort_order=" +
            sortOEnc,
        triedCount: 0,
        retryLimit: 3,
        error: function (xhr, textStatus, errorThrown) {
            console.log("error: " + this.triedCount);
            this.triedCount++;
            if (this.triedCount < this.retryLimit && xhr.status >= 500) {
                console.log(this);
                $.ajax(this);
            } else {
                dfd.reject(xhr);
            }
        },
        success: function (response) {
            dfd.resolve(response);
        }
    });

    return dfd.promise();
};

Soluntech.prototype.findById = function (objectId, id) {

    var dfd = $.Deferred();

    $.ajax({
        type: 'GET',
        headers: this.headers,
        url: this.knackURL + 'objects/' + objectId + '/records/' + id,
        triedCount: 0,
        retryLimit: 3,
        error: function (xhr, textStatus, errorThrown) {
            console.log("error: " + this.triedCount);
            this.triedCount++;
            if (this.triedCount < this.retryLimit && xhr.status >= 500) {
                console.log(this);
                $.ajax(this);
            } else {
                dfd.reject(xhr);
            }
        },
        success: function (response) {
            dfd.resolve(response);
        }
    });

    return dfd.promise();
};

Soluntech.prototype.update = function (objectId, id, data) {

    var dfd = $.Deferred();

    $.ajax({
        type: 'PUT',
        headers: this.headers,
        url: this.knackURL + 'objects/' + objectId + '/records/' + id,
        data: data,
        triedCount: 0,
        retryLimit: 3,
        error: function (xhr, textStatus, errorThrown) {
            console.log("error: " + this.triedCount);
            this.triedCount++;
            if (this.triedCount < this.retryLimit && xhr.status >= 500) {
                console.log(this);
                $.ajax(this);
            } else {
                dfd.reject(xhr);
            }
        },
        success: function (response) {
            dfd.resolve(response);
        }
    });

    return dfd.promise();
};

Soluntech.prototype.delete = function (objectId, id) {

    var dfd = $.Deferred();

    $.ajax({
        type: 'DELETE',
        headers: this.headers,
        url: this.knackURL + 'objects/' + objectId + '/records/' + id,
        triedCount: 0,
        retryLimit: 3,
        error: function (xhr, textStatus, errorThrown) {
            console.log("error: " + this.triedCount);
            this.triedCount++;
            if (this.triedCount < this.retryLimit && xhr.status >= 500) {
                console.log(this);
                $.ajax(this);
            } else {
                dfd.reject(xhr);
            }
        },
        success: function (response) {
            dfd.resolve(response);
        }
    });

    return dfd.promise();
};

Soluntech.prototype.deleteMultiple = function (objectId, info, callback) {

    var filters = info.filters || [];
    var sortOrder = info.sortOrder || '';
    var sortField = info.sortField || '';
    var recordPerPage = info.recordPerPage || 'all';

    var filterValEnc = encodeURIComponent(JSON.stringify(filters));
    var sortFEnc = encodeURIComponent(sortField);
    var sortOEnc = encodeURIComponent(sortOrder);
    var self = this;

    self.$.ajax({
        type: 'GET',
        headers: self.headers,
        url: self.knackURL + 'objects/' + objectId + '/records?rows_per_page=' + recordPerPage +
            '&filters=' + filterValEnc + "&sort_field=" + sortFEnc + "&sort_order=" +
            sortOEnc
    })
        .then(function (response) {

            var ids = response.records.map(function (record) {

                return record.id;
            });

            if (!ids.length) {
                return null;
            }

            return self.$.ajax({
                type: 'POST',
                headers: self.headers,
                url: self.knackURL + 'objects/' + objectId + '/records/delete',
                data: {
                    ids: ids
                }
            });
        })
        .then(function (response) {

            callback(null, response);
            return null;
        })
        .fail(callback)
};

Soluntech.prototype.enableElement = function (selector) {

    var $element = this.$(selector);

    if ($element && $element.length) {
        $element.removeAttr('disabled');
    }
};

Soluntech.prototype.disableElement = function (selector) {

    var $element = this.$(selector);

    if ($element && $element.length) {
        $element.attr('disabled', 'disabled');
    }
};

Soluntech.prototype.create = function (objectId, data) {

    var dfd = $.Deferred();

    $.ajax({
        type: 'POST',
        headers: this.headers,
        url: this.knackURL + 'objects/' + objectId + '/records',
        data: data,
        triedCount: 0,
        retryLimit: 3,
        error: function (xhr, textStatus, errorThrown) {
            console.log("error: " + this.triedCount);
            this.triedCount++;
            if (this.triedCount < this.retryLimit && xhr.status >= 500) {
                console.log(this);
                $.ajax(this);
            } else {
                dfd.reject(xhr);
            }
        },
        success: function (response) {
            dfd.resolve(response);
        }
    });

    return dfd.promise();
};

Soluntech.prototype.upload = function (type, blob, filename) {

    var dfd = $.Deferred();
    var upload_headers = this.headers;
    delete upload_headers['content-type'];

    var fd = new FormData();

    if (filename) {
        fd.append('files', blob, filename);
    }
    else {
        fd.append('files', blob);
    }

    $.ajax({
        type: 'POST',
        headers: upload_headers,
        url: this.knackURL + 'applications/' + this.applicationID + '/assets/' + type + '/upload',
        data: fd,
        processData: false,
        contentType: false,
        triedCount: 0,
        retryLimit: 3,
        error: function (xhr, textStatus, errorThrown) {
            console.log("error: " + this.triedCount);
            this.triedCount++;
            if (this.triedCount < this.retryLimit && xhr.status >= 500) {
                console.log(this);
                $.ajax(this);
            } else {
                dfd.reject(xhr);
            }
        },
        success: function (response) {
            dfd.resolve(response);
        }
    });

    return dfd.promise();
};

Soluntech.prototype.getFieldValue = function (object, field, type) {

    if (!object) {
        return object;
    }

    if (type === 'raw' || type === 'number') {
        return object[field + '_raw'];
    }

    if (type === 'date') {
        var val = object[field + '_raw'];
        var nullVal = {};

        if (!val) {
            return nullVal;
        }

        return val;
    }

    if (type === 'name') {
        var val = object[field + '_raw'];
        var nullVal = { first: '', last: '' };

        if (!val) {
            return nullVal;
        }

        return val;
    }

    if (type === 'email') {
        var val = object[field + '_raw'];

        return val && val.email;
    }

    if (type === 'image' || type === 'file') {
        var val = object[field + '_raw'];
        var nullVal = { url: '' };

        if (!val) {
            return nullVal;
        }

        return val;
    }

    if (type === 'address') {
        var val = object[field + '_raw'];
        var nullVal = { city: '', state: '', stree: '', street2: '', zip: '' };

        if (!val) {
            return nullVal;
        }

        return val;
    }

    if (type === 'connection') {
        var val = object[field + '_raw'];
        var nullVal = { id: null, identifier: '' };

        if (!val) {
            return nullVal;
        }

        if (Array.isArray(val)) {
            if (val.length < 1) {
                return nullVal;
            }

            return val.length === 1 ? val[0] : val;
        }

        return val;
    }

    return object[field];
};

Soluntech.prototype.valueIsId = function (str) {

    str = str + '';

    var len = str.length;
    var isId = false;

    if (len == 12 || len == 24) {
        isId = /^[0-9a-fA-F]+$/.test(str);
    }

    return isId;
};

Soluntech.prototype.updateQueryStringParameter = function (key, value, uri) {

    uri = uri || window.location.href;
    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';

    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + value + '$2');
    }
    else {
        return uri + separator + key + '=' + value;
    }
};

Soluntech.prototype.updateLocationWithoutReloading = function (newUrl) {

    if (window.history.pushState) {
        window.history.pushState({
            path: newUrl
        }, '', newUrl);
    }
};

Soluntech.prototype.getParameterByName = function (name, uri) {

    uri = uri || window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(uri);

    if (!results) {
        return null;
    }

    if (!results[2]) {
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

Soluntech.prototype.showInstructions = function (divField, content, color) {

    var self = this;
    var $knInstructions = self.$(divField).find('p.kn-instructions');

    color = color || 'black';

    $knInstructions.html(content);
    $knInstructions.css('color', color);
    $knInstructions.show();
};

Soluntech.prototype.hideInstructions = function (divField) {

    var self = this;

    var $knInstructions = self.$(divField).find('p.kn-instructions');

    $knInstructions.html('');
    $knInstructions.hide();
};

Soluntech.prototype.refreshView = function (view, done) {

    done = done || function () { };

    try {
        Knack.views[view].model.fetch({
            success: function () {
                Knack.views[view].render();
                done();
            }
        });

    }
    catch (e) {
        done(e);
    }
};

Soluntech.prototype.removeIfIsInDOM = function (selector) {

    var self = this;
    var $selector = self.$(selector);

    if ($selector && $selector.length) {
        $selector.remove();
        return true;
    }

    return false;
};

Object.defineProperty(Soluntech.prototype, 'isAuthenticated', {
    get: function isAuthenticated() {

        return !Knack.user.id ? false : true;
    }
});

Soluntech.prototype.startIdleTimer = function (userOptions) {

    var options = {
        selector: document,
        timeout: 300000,    // 5 mins
        idle: false,
        userGoesIdleCallback: function () { },
        userBecomesActive: function () { }
    };
    var self = this;

    self.$.extend(options, userOptions || {});
    self.loadLibrary('jquery', 'idleTimer', function () {

        self.$(options.selector).idleTimer({
            idle: options.idle,
            timeout: options.timeout
        });

        self.$(options.selector).on('idle.idleTimer', function (event, elem, obj) {

            options.userGoesIdleCallback(event, elem, obj);
        });

        self.$(options.selector).on('active.idleTimer', function (event, elem, obj, triggerevent) {

            options.userBecomesActive(event, elem, obj, triggerevent);
        });
    });
};

Soluntech.prototype.updateIdleTimer = function (userOptions) {

    var options = {
        selector: document,
        event: 'destroy'
    };
    var self = this;

    self.$.extend(options, userOptions || {});
    self.loadLibrary('jquery', 'idleTimer', function () {

        self.$(options.selector).idleTimer(options.event);
        self.$(options.selector).off('idle.idleTimer');
        self.$(options.selector).off('active.idleTimer');
    });
};

Soluntech.prototype.logout = function () {

    var link = document.getElementsByClassName('kn-log-out');

    if (link && link[0]) {
        link[0].click();
    }
};
