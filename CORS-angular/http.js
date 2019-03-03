/**
 *  Author by J.
 * 由于默认angular提供的异步请求对象不支持自定义回调函数名
 * angular随机分配的回调函数名称不被豆瓣支持，所以自定义一个jsonp
 */
;(function (angular) {
    'use strict';
    angular.module('myApp.servers.http', [])
        .service('myHttp', ['$window', '$document', function ($window, $document) {
            this.jsonp = function (url, params) {
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

                    // 创建script便签并append到文档中
                    let document = $document[0];
                    let script = document.createElement('script');
                    script.src = getUrl(url, params);
                    let head = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
                    head.appendChild(script);

                    // 请求数据失败
                    script.addEventListener('error', function (err) {
                        delete $window[callbackName];
                        head.removeChild(script);
                        reject(err)
                    });

                    // 成功获取数据
                    $window[callbackName] = function (data){
                        delete $window[callbackName];
                        head.removeChild(script);
                        resolve(data);
                    }
                })
            }
        }])
})(angular);
