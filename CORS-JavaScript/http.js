/**
 *  js原生自定义jsonp插件
 * 只需在HTML中引入http.js然后调用即可
 *  调用 $jsonp(url, {}, fun)
 */

;(function (window, document, undefined) {
    'use strict';
    window.$jsonp = function (url, params, callback) {
        // 回调函数加一个随机后缀
        let callbackName = 'json_cb_' + new Date().getTime();
        window[callbackName] = callback;
        // 将传递的params参数拼接到url后面,并将callbackName拼接到url后面
        let queryStr = url.indexOf('?') === -1 ? '?' : '&';
        Object.keys(params).forEach(function (key) {
            queryStr += key + "=" + params[key] + '&';
        });

        // 注意这个键callback可以替换成其他字符串，但一般使用'callback'
        queryStr += 'callback=' + callbackName;
        let script = document.createElement('script');
        script.src = url + queryStr;
        (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script)
    }
})(window, document);

