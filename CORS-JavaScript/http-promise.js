/**
 *  js原生自定义jsonp插件
 * 只需在HTML中引入http.js然后调用即可
 *  调用 $jsonp(url, {}).then()
 */
;(function (window, document, undefined){
    window.$jsonp = function (url, params) {
        return new Promise(function (resolve, reject) {
            // 定义一个随机的回调挂载到window上，得到数据后销毁
            let callbackName = 'json_cb_' + new Date().getTime();

            // 获取拼接好的url
            let getUrl = function (url, params){
                // 将传递的params参数拼接到url后面,并将callbackName拼接到url后面
                let queryStr = url.indexOf('?') > 0? '&':'?';
                Object.keys(params).forEach(function (key) {
                    queryStr += key + '=' + params[key] + '&';
                });
                // 注意这个键callback可以替换成其他字符串，但一般使用'callback'
                queryStr += 'callback=' + callbackName;

                return url +queryStr;
            };

            let script = document.createElement('script');
            script.src = getUrl(url, params);
            let head = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
            head.appendChild(script);

            // 请求数据失败
            script.addEventListener('error', function (err){
                delete window[callbackName];
                head.removeChild(script);
                reject(err);
            });

            // 获取数据后清除全局对象和生成的script标签
            window[callbackName] = function (data){
                delete window[callbackName];
                head.removeChild(script);
                resolve(data);
            }
        });
    }
})(window, document);

