var app = angular.module('chantrerieApp');

app.run(function($rootScope, $location, $route/*, user*/) {

});

app.config(['$routeProvider', function ($routeProvider){
    $routeProvider.
    
        when('/viewGestion', {
            templateUrl: 'views/gestionView.html',
            controller: 'MainCtrl'
        }).

        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'MainCtrl'
        }).
        
        when('/viewStat', {
            templateUrl: 'views/statView.html',
            controller: 'MainCtrl'
        }).
    
        otherwise({
            redirectTo: '/login' 
        });

}]);