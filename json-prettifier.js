(function ($) {
    'use strict';
    $.fn.jsonPrettifier = function () {

        var method,
        args,
        props = {},
        tabSize = 4,
        proxies = {},
        linkRegexp = /^[\w]+:\/\//,
        json,
        interceptCallback = false,
        that;

        ////////////////////////////////////////////////////////////////////////////////////
        // Functions
        ////////////////////////////////////////////////////////////////////////////////////
        function printValue(value) {
            var html, klass, inner = "";

            if (typeof value === "string" && linkRegexp.test(value)) {
                inner = '<a href="' + value + '" target="_blank"">' + value + '</a>';
                klass = "url";
            } else {
                inner = value;
                klass = typeof value;
            }

            html = '<span class="value ' + klass + '">' + inner + '</span>';
            return html;
        }

        function walkObject(object, indent) {
            var el, html;
            indent = indent || 0;
            indent += tabSize;
            html = '<span class="object"><span class="curly">{</span>';
            for (el in object) {
                if (object.hasOwnProperty(el)) {
                    html += '<div class="key-value-pair" style="margin-left: ' + indent + 'px">';
                    html += '<span class="key object-key">' + el + '</span>';
                    if ($.isArray(object[el])) {
                        html += walkArray(object[el], indent);
                    } else if (typeof object[el] === "object") {
                        html += walkObject(object[el], indent);
                    } else {
                        html += printValue(object[el]);
                    }
                    html += '</div>';
                }
            }
            html += '<span class="curly">}</span></span>';

            return html;
        }

        //todo: merge with walkObject
        function walkArray(array, indent) {
            var i, html;
            indent = indent || 0;
            indent += tabSize;
            html = '<span class="array"  style="margin-left: ' + indent + 'px"><span class="bracket">[</span>';
            for (i = 0; i < array.length; i++) {
                html += '<div class="key-value-pair" style="margin-left: ' + indent + 'px">';
                html += '<span class="key array-key">' + i + '</span>';
                if ($.isArray(array[i])) {
                    html += walkArray(array[i], indent);
                } else if (typeof array[i] === "object") {
                    html += walkObject(array[i], indent);
                } else {
                    html += printValue(array[i]);
                    if (i < array.length - 1) {
                        html += ',';
                    }
                }
                html += '</div>';
            }
            html += '<span class="bracket">]</span></span>';

            return html;
        }

        function htmlifyJSON(json) {
            var html = '<div class="json">';
            if ($.isArray(json)) {
                html += walkArray(json);
            } else {
                html += walkObject(json);
            }
            html += '</div>';

            html = $(html);
            html.find('.key').each(function (i, el) {
                $(el).click(function () {
                    var key = $(this);
                    if (key.next().is(":visible")) {
                        key.next().hide();
                        key.parent().append('<i>...</i>');
                    } else {
                        key.parent().find("i:last").detach();
                        key.next().show();
                    }
                });
            });


            if (interceptCallback) {
                //todo: use a global onclick handler instead
                html.find('.url a').each(function () {
                    $(this).click(function (ev) {
                        var url = $(this).attr('href');
                        var p_url = getProxy(url);
                        if (p_url !== url) {
                            ev.preventDefault();
                        }
                        interceptCallback(p_url);
                    });
                });
            }

            return html;
        }

        function getProxy(url) {
            for (var proxy in proxies) {
                if (url.match(proxy)) {
                    url = url.replace(proxy, proxies[proxy]);
                }
            }
            return url;
        }

        function render(json) {
            if (typeof json === "string") {
                json = JSON.parse(json);
            }
            that.html(htmlifyJSON(json));
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Init code
        ////////////////////////////////////////////////////////////////////////////////////

        if (typeof arguments[0] === "string") {
            method = arguments[0];
            args = Array.prototype.slice.call(arguments, 1);
        }

        if (method === "init") {
            props = arguments[1];
        } else if (method === "render") {
            props = arguments[2] || props;
        } else if (!method) {
            props = arguments[0] || props;
        }

        that = this;

        tabSize = $.fn.jsonPrettifier.tabSize =  props.tabSize || $.fn.jsonPrettifier.tabSize || tabSize;

        proxies = $.fn.jsonPrettifier.proxies = props.proxies || $.fn.jsonPrettifier.proxies || proxies;

        interceptCallback = $.fn.jsonPrettifier.interceptCallback = props.interceptCallback || $.fn.jsonPrettifier.interceptCallback || interceptCallback;

        linkRegexp = $.fn.jsonPrettifier.linkRegexp = props.linkRegexp || $.fn.jsonPrettifier.linkRegexp || linkRegexp;
        
        this.addClass("json-prettifier");
        
        json = method === "render" ? args[0] : props.json;
        try {
            if (typeof json === "object") {
                json = JSON.stringify(json);
            }
            if (typeof json === "string") {
                json = JSON.parse(json);
            }
            render(json);
        } catch (ex) {
            this.html("Exception when parsing json " + ex);
            throw ex;
        }

    };
}(jQuery));
