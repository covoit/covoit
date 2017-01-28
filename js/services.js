var app = angular.module('chantrerieApp');

app.service('RESPONSE', function () {
   
    var responseJson;
    
    return {
        setResponse: function (response) {
            this.responseJson = response;
            console.log(responseJson);
        },
        getResponse: function () {
            return this.responseJson;
        }
    }
    
});