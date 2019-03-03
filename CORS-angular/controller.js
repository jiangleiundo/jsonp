'use strict';

angular.module('myApp.dbMovie', ['ngRoute', 'myApp.servers.http'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/:category/:page', {
            templateUrl: 'dbMovie/view.html',
            controller: 'DbMovieCtrl'
        });
    }])

    .controller('DbMovieCtrl', ['$scope', '$route', '$routeParams', 'myHttp', function ($scope, $route, $routeParams, myHttp) {
        let self = $scope;
        self.loading = 1;
        self.model = {
            title: '',
            data: [],
        };
        // 分页参数
        self.page = {};
        self.page.count = 5;
        self.page.curPage = parseInt($routeParams.page);
        self.page.start = (self.page.curPage - 1) * self.page.count;
        self.page.totalPage = 0;
        self.page.totalCount = 0;

        // 正在热映api
        let douBanUrl = 'https://api.douban.com/v2/movie/' + $routeParams.category;
        myHttp.jsonp(douBanUrl, {start: self.page.start, count: self.page.count})
            .then(function (res) {

                if (!res) {
                    self.msg = '暂时没有数据';
                } else {
                    self.page.totalCount = res.total;
                    self.page.totalPage = Math.ceil(self.page.totalCount / self.page.count);

                    self.model.title = res.title;
                    self.model.data = res.subjects;
                }
                self.loading = 0;
                self.$apply();
            }, function (err) {
                self.msg = err.type + '：请求数据失败';
                self.loading = 0;
                self.$apply();
            });

        // 跳页上一页，下一页
        self.go2 = function (e, page) {
            e.preventDefault();

            if (page < 1 || page > self.page.totalPage) return;
            $route.updateParams({page: page})
        }
    }]);