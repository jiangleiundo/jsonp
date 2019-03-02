# jsonp
一个自定义的JavaScript原生jsonp插件

- js原生

  - 使用方法

    ```javascript
    ;(function(){
        $jsonp(url, {}, function(data){
            console.log(data)
        })
    })()
    ```

- promise--推荐使用

  - 使用方法

    ```javascript
    ;(function () {
        let url = 'https://api.xxx';
        $jsonp(url, {})
            .then(function (res) {
            if (res) {
                console.log(res)
            } else {
                console.log('未返回数据');
            }
        }, function (err) {
            console.log(err.type + '：请求失败');
        })
    })()
    ```
