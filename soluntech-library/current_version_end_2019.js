var Soluntech = function(e) {
    this.applicationID = e.applicationID, this.restAPIkey = e.restAPIkey, this.knackURL = e.knackURL || "https://api.knack.com/v1/", this.jQuery = e.jQuery || window.$, this.environment = e.environment || "production", this.isProduction = "production" === this.environment, this.isDevelopment = "development" === this.environment, this.$spinnerBackdrop = null, this.libraries = e.libraries || {
        moment: {
            url: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js",
            loaded: !1,
            objectName: "moment"
        },
        async: {
            url: "https://cdnjs.cloudflare.com/ajax/libs/async/2.4.1/async.min.js",
            loaded: !1,
            objectName: "async"
        },
        jquery: {
            url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js",
            loaded: !1,
            objectName: "jQuery"
        },
        idleTimer: {
            url: "https://cdnjs.cloudflare.com/ajax/libs/jquery-idletimer/1.0.0/idle-timer.min.js",
            loaded: !1,
            objectName: "idleTimer"
        },
        chartjs: {
            url: "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js",
            loaded: !1,
            objectName: "chartjs"
        }
    }, this.assert(Knack || window.Knack, "Error, this library only run on Knack applications"), this.assert(this.jQuery, "Error, jQuery instance is required")
};
Object.defineProperty(Soluntech.prototype, "$", {
    get: function() {
        return window.jQuery || this.jQuery || window.$
    }
}), Soluntech.prototype.set = function(e, t) {
    Object.defineProperty(Soluntech.prototype, e, {
        get: function() {
            return t
        }
    })
}, Soluntech.prototype.log = function() {
    var e = Array.prototype.slice.call(arguments);
    console && "function" == typeof console.log && this.isDevelopment && console.log.apply(console, e)
}, Soluntech.prototype.warn = function() {
    var e = Array.prototype.slice.call(arguments);
    console && "function" == typeof console.warn && this.isDevelopment && console.warn.apply(console, e)
}, Soluntech.prototype.error = function() {
    var e = Array.prototype.slice.call(arguments);
    console && "function" == typeof console.error && this.isDevelopment && console.error.apply(console, e)
}, Soluntech.prototype.debug = function() {
    var e = Array.prototype.slice.call(arguments);
    console && "function" == typeof console.debug && this.isDevelopment && console.debug.apply(console, e)
}, Soluntech.prototype.assert = function(e, t) {
    if (!e) throw new Error(t)
}, Object.defineProperty(Soluntech.prototype, "headers", {
    get: function() {
        return {
            "X-Knack-Application-ID": this.applicationID,
            "X-Knack-REST-API-Key": this.restAPIkey,
            "content-type": "application/json"
        }
    }
}), Soluntech.prototype.next = function(e) {
    setTimeout(function() {
        e()
    }, 0)
}, Soluntech.prototype.showSpinner = function(e) {
    this.$spinnerBackdrop || (this.$spinnerBackdrop = this.$('<div style="z-index: 100000; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></div>'), this.$spinnerBackdrop.appendTo("body"), this.next(function() {
        Knack.showSpinner(), "function" == typeof e && e()
    }))
}, Soluntech.prototype.hideSpinner = function(e) {
    this.$spinnerBackdrop && (this.$spinnerBackdrop.remove(), this.$spinnerBackdrop = null), this.next(function() {
        Knack.hideSpinner(), "function" == typeof e && e()
    })
}, Soluntech.prototype.load = function(e, t) {
    var o = this;
    LazyLoad.js(e, function() {
        t.call(o)
    })
}, Soluntech.prototype.loadLibrary = function() {
    var e, t = Array.prototype.slice.call(arguments),
        o = t.pop(),
        r = [],
        n = this;
    if (t.forEach(function(t) {
            e = n.libraries[t], e && !e.loaded && (e.loaded = !0, r.push(e.url))
        }), !r.length) return o.call(this);
    this.load(r, o)
}, Soluntech.prototype.libraryIsLoaded = function(e) {
    var t = this.libraries[e];
    return !!t && t.loaded
}, Soluntech.prototype.insertLibrary = function(e, t) {
    var o = this.libraries[e];
    o || (this.libraries[e] = {
        url: t,
        loaded: !1
    })
}, Soluntech.prototype.addTask = function(e, t, o) {
    this.$(document).on(t, o.bind(this))
}, Soluntech.prototype.addMethod = function(e, t) {
    Object.defineProperty(Soluntech.prototype, e, {
        get: function() {
            return t.bind(this)
        }
    })
}, Soluntech.prototype.librariesRequired = function() {
    var e, t = Array.prototype.slice.call(arguments),
        o = this;
    t.forEach(function(t) {
        e = o.libraries[t], o.assert(e, 'Library "' + t + "\" don' exists"), o.assert(window[e.objectName], 'Library "' + t + '" is required')
    })
}, Soluntech.prototype.find = function(e, t, o, r, n) {
    t = t || [], r = r || "", o = o || "", n = n || "all";
    var i = encodeURIComponent(JSON.stringify(t)),
        s = encodeURIComponent(o),
        c = encodeURIComponent(r),
        l = $.Deferred();
    return $.ajax({
        type: "GET",
        headers: this.headers,
        url: this.knackURL + "objects/" + e + "/records?rows_per_page=" + n + "&filters=" + i + "&sort_field=" + s + "&sort_order=" + c,
        triedCount: 0,
        retryLimit: 3,
        error: function(e, t, o) {
            console.log("error: " + this.triedCount), this.triedCount++, this.triedCount < this.retryLimit && e.status >= 500 ? (console.log(this), $.ajax(this)) : l.reject(e)
        },
        success: function(e) {
            l.resolve(e)
        }
    }), l.promise()
}, Soluntech.prototype.findById = function(e, t) {
    var o = $.Deferred();
    return $.ajax({
        type: "GET",
        headers: this.headers,
        url: this.knackURL + "objects/" + e + "/records/" + t,
        triedCount: 0,
        retryLimit: 3,
        error: function(e, t, r) {
            console.log("error: " + this.triedCount), this.triedCount++, this.triedCount < this.retryLimit && e.status >= 500 ? (console.log(this), $.ajax(this)) : o.reject(e)
        },
        success: function(e) {
            o.resolve(e)
        }
    }), o.promise()
}, Soluntech.prototype.update = function(e, t, o) {
    var r = $.Deferred();
    return $.ajax({
        type: "PUT",
        headers: this.headers,
        url: this.knackURL + "objects/" + e + "/records/" + t,
        data: o,
        triedCount: 0,
        retryLimit: 3,
        error: function(e, t, o) {
            console.log("error: " + this.triedCount), this.triedCount++, this.triedCount < this.retryLimit && e.status >= 500 ? (console.log(this), $.ajax(this)) : r.reject(e)
        },
        success: function(e) {
            r.resolve(e)
        }
    }), r.promise()
}, Soluntech.prototype.delete = function(e, t) {
    var o = $.Deferred();
    return $.ajax({
        type: "DELETE",
        headers: this.headers,
        url: this.knackURL + "objects/" + e + "/records/" + t,
        triedCount: 0,
        retryLimit: 3,
        error: function(e, t, r) {
            console.log("error: " + this.triedCount), this.triedCount++, this.triedCount < this.retryLimit && e.status >= 500 ? (console.log(this), $.ajax(this)) : o.reject(e)
        },
        success: function(e) {
            o.resolve(e)
        }
    }), o.promise()
}, Soluntech.prototype.deleteMultiple = function(e, t, o) {
    var r = t.filters || [],
        n = t.sortOrder || "",
        i = t.sortField || "",
        s = t.recordPerPage || "all",
        c = encodeURIComponent(JSON.stringify(r)),
        l = encodeURIComponent(i),
        a = encodeURIComponent(n),
        u = this;
    u.$.ajax({
        type: "GET",
        headers: u.headers,
        url: u.knackURL + "objects/" + e + "/records?rows_per_page=" + s + "&filters=" + c + "&sort_field=" + l + "&sort_order=" + a
    }).then(function(t) {
        var o = t.records.map(function(e) {
            return e.id
        });
        return o.length ? u.$.ajax({
            type: "POST",
            headers: u.headers,
            url: u.knackURL + "objects/" + e + "/records/delete",
            data: {
                ids: o
            }
        }) : null
    }).then(function(e) {
        return o(null, e), null
    }).fail(o)
}, Soluntech.prototype.enableElement = function(e) {
    var t = this.$(e);
    t && t.length && t.removeAttr("disabled")
}, Soluntech.prototype.disableElement = function(e) {
    var t = this.$(e);
    t && t.length && t.attr("disabled", "disabled")
}, Soluntech.prototype.create = function(e, t) {
    var o = $.Deferred();
    return $.ajax({
        type: "POST",
        headers: this.headers,
        url: this.knackURL + "objects/" + e + "/records",
        data: t,
        triedCount: 0,
        retryLimit: 3,
        error: function(e, t, r) {
            console.log("error: " + this.triedCount), this.triedCount++, this.triedCount < this.retryLimit && e.status >= 500 ? (console.log(this), $.ajax(this)) : o.reject(e)
        },
        success: function(e) {
            o.resolve(e)
        }
    }), o.promise()
}, Soluntech.prototype.getFieldValue = function(e, t, o) {
    if (!e) return e;
    if ("raw" === o || "number" === o) return e[t + "_raw"];
    if ("date" === o) {
        var r = e[t + "_raw"],
            n = {};
        return r || n
    }
    if ("name" === o) {
        r = e[t + "_raw"], n = {
            first: "",
            last: ""
        };
        return r || n
    }
    if ("email" === o) {
        r = e[t + "_raw"];
        return r && r.email
    }
    if ("image" === o || "file" === o) {
        r = e[t + "_raw"], n = {
            url: ""
        };
        return r || n
    }
    if ("address" === o) {
        r = e[t + "_raw"], n = {
            city: "",
            state: "",
            stree: "",
            street2: "",
            zip: ""
        };
        return r || n
    }
    if ("connection" === o) {
        r = e[t + "_raw"], n = {
            id: null,
            identifier: ""
        };
        return r ? Array.isArray(r) ? r.length < 1 ? n : 1 === r.length ? r[0] : r : r : n
    }
    return e[t]
}, Soluntech.prototype.valueIsId = function(e) {
    e += "";
    var t = e.length,
        o = !1;
    return 12 != t && 24 != t || (o = /^[0-9a-fA-F]+$/.test(e)), o
}, Soluntech.prototype.updateQueryStringParameter = function(e, t, o) {
    o = o || window.location.href;
    var r = new RegExp("([?&])" + e + "=.*?(&|$)", "i"),
        n = -1 !== o.indexOf("?") ? "&" : "?";
    return o.match(r) ? o.replace(r, "$1" + e + "=" + t + "$2") : o + n + e + "=" + t
}, Soluntech.prototype.updateLocationWithoutReloading = function(e) {
    window.history.pushState && window.history.pushState({
        path: e
    }, "", e)
}, Soluntech.prototype.getParameterByName = function(e, t) {
    t = t || window.location.href, e = e.replace(/[\[\]]/g, "\\$&");
    var o = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)"),
        r = o.exec(t);
    return r ? r[2] ? decodeURIComponent(r[2].replace(/\+/g, " ")) : "" : null
}, Soluntech.prototype.showInstructions = function(e, t, o) {
    var r = this,
        n = r.$(e).find("p.kn-instructions");
    o = o || "black", n.html(t), n.css("color", o), n.show()
}, Soluntech.prototype.hideInstructions = function(e) {
    var t = this,
        o = t.$(e).find("p.kn-instructions");
    o.html(""), o.hide()
}, Soluntech.prototype.refreshView = function(e, t) {
    t = t || function() {};
    try {
        Knack.views[e].model.fetch({
            success: function() {
                Knack.views[e].render(), t()
            }
        })
    } catch (e) {
        t(e)
    }
}, Soluntech.prototype.removeIfIsInDOM = function(e) {
    var t = this,
        o = t.$(e);
    return !(!o || !o.length) && (o.remove(), !0)
}, Object.defineProperty(Soluntech.prototype, "isAuthenticated", {
    get: function() {
        return !!Knack.user.id
    }
}), Soluntech.prototype.startIdleTimer = function(e) {
    var t = {
            selector: document,
            timeout: 3e5,
            idle: !1,
            userGoesIdleCallback: function() {},
            userBecomesActive: function() {}
        },
        o = this;
    o.$.extend(t, e || {}), o.loadLibrary("jquery", "idleTimer", function() {
        o.$(t.selector).idleTimer({
            idle: t.idle,
            timeout: t.timeout
        }), o.$(t.selector).on("idle.idleTimer", function(e, o, r) {
            t.userGoesIdleCallback(e, o, r)
        }), o.$(t.selector).on("active.idleTimer", function(e, o, r, n) {
            t.userBecomesActive(e, o, r, n)
        })
    })
}, Soluntech.prototype.updateIdleTimer = function(e) {
    var t = {
            selector: document,
            event: "destroy"
        },
        o = this;
    o.$.extend(t, e || {}), o.loadLibrary("jquery", "idleTimer", function() {
        o.$(t.selector).idleTimer(t.event), o.$(t.selector).off("idle.idleTimer"), o.$(t.selector).off("active.idleTimer")
    })
}, Soluntech.prototype.logout = function() {
    var e = document.getElementsByClassName("kn-log-out");
    e && e[0] && e[0].click()
};
