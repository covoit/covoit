var app = angular.module('chantrerieApp');

app.controller('MainCtrl', function ($scope, $http, $location, $window, $uibModal,$filter, localStorageService, RESPONSE) {
    /*Controle d'authentification*/
    $scope.message = "Entrez vos identifiants";
    function check() {
        if ($window.localStorage['conn'] == 'ADMIN') {
            $location.path("/viewGestion")
        } else {
            $location.path("/login");
        }
    }
    check();
    
    $scope.exportMembers = function () {
        
        var columns = [
        {title: "Email", dataKey: "email"},
        {title: "Telephone", dataKey: "tel"}, 
        {title: "Pseudo", dataKey: "username"},
        {title: "Autorité", dataKey: "power"},
        {title: "Type", dataKey: "type"}
        ];
        //http://localhost/chantrerieAPI2/Get_membres.php
        $http.get("https://chantrerie.000webhostapp.com/Get_membres.php")
           .success(function (response) {
                var rows = response;
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    styles: {fillColor: [100, 150, 255]},
                    columnStyles: {
                        email: {fillColor: 255}
                    },
                    margin: {top: 60},
                    beforePageContent: function(data) {
                        doc.text("Liste des membres", 40, 30);
                    }
                });
                doc.save('table.pdf');
           });
    }
    
    
    
    $scope.disconnect = function () {
        localStorageService.clearAll();
        $window.localStorage['conn'] = "UNREGISTERED";
        $location.path("/login");
    }
    
    $scope.export = function () {
        var divContent = document.getElementById('test').innerHTML,
        printWindow = window.open("", "", "width=800, height=600");
    }

    function newDate() {

      $scope.currDate = new Date();

      
      $scope.currDate = $scope.currDate.getUTCFullYear() + '-' +
          ('00' + ($scope.currDate.getUTCMonth()+1)).slice(-2) + '-' +
          ('00' + $scope.currDate.getUTCDate()).slice(-2) + ' ' + 
          ('00' + $scope.currDate.getUTCHours()).slice(-2) + ':' + 
          ('00' + $scope.currDate.getUTCMinutes()).slice(-2) + ':' + 
          ('00' + $scope.currDate.getUTCSeconds()).slice(-2);

      return $scope.currDate;

    }
    
    $scope.login = function () {
        //http://localhost/chantrerieAPI2/UserLogin.php
        var link = "https://chantrerie.000webhostapp.com/UserLogin.php";
        $http.post(link, {email : $scope.data.email, password: $scope.data.password, loginDate: newDate()}).then(function (res){
            if (res.data.power == "ADMIN") {
              localStorageService.clearAll();
              $window.localStorage['conn'] = "ADMIN";
              $window.localStorage['email'] = $scope.data.email;
              $window.localStorage['username'] = res.data.username;
              $scope.currentlystored = $window.localStorage['conn'];
              $scope.message = "Connecté en tant qu'administrateur";
              $location.path("/viewGestion");
            } else if (res.data.power == "USER") {
                $scope.message = "Vous n'avez pas la permission!";
            } else {
                $scope.message = "Votre compte n'existe pas!";   
            }
        });
    }
    
    /*Requêtes insert*/
    
    $scope.insertCompany = function () {
        //var link = "http://localhost/chantrerieAPI2/InsertCompany.php";
        var link = "https://chantrerie.000webhostapp.com/InsertCompany.php";
        $http.post(link, {email : $window.localStorage['email'], company: $scope.nomCompany}).then(function (res){
            if (res.data == "SUCCESS") {
              //http://localhost/chantrerieAPI2
              $http.get("https://chantrerie.000webhostapp.com/Get_entreprise.php")
                   .success(function (response) {
                        $scope.nomCompany = "";
                   });
            }
        });
    }
    
    /*Requêtes get*/
    
    /*http://localhost/chantrerieAPI/Get.php*/
    //http://localhost/chantrerieAPI2/Get_Statistiques.php
    $http.get("https://chantrerie.000webhostapp.com/Get_Statistiques.php")
       .success(function (response) {
            $scope.dataStatistiques = {};
            $scope.dataStatistiques.data = response;
       });
    //http://localhost/chantrerieAPI2/Get_membres_derniers_inscrits.php
    $http.get("https://chantrerie.000webhostapp.com/Get_membres_derniers_inscrits.php")
       .success(function (response) {
            $scope.derniersInscrits = {};
            $scope.derniersInscrits.data = response;
       });
    //http://localhost/chantrerieAPI2/Get_membres_derniers_connexions.php
    $http.get("https://chantrerie.000webhostapp.com/Get_membres_derniers_connexions.php")
       .success(function (response) {
            $scope.derniersConnexions = {};
            $scope.derniersConnexions.data = response;
       });
    //http://localhost/chantrerieAPI2/Get_membres_desactive.php
    $http.get("https://chantrerie.000webhostapp.com/Get_membres_desactive.php")
       .success(function (response) {
            $scope.disableMembers = {};
            $scope.disableMembers.data = response;
       });
    //http://localhost/chantrerieAPI2/Get_commentaires.php
    $http.get("https://chantrerie.000webhostapp.com/Get_commentaires.php")
       .success(function (response) {
            $scope.commentaires = response;
       });
    //http://localhost/chantrerieAPI2/Get_entreprise.php
    $http.get("https://chantrerie.000webhostapp.com/chantrerieAPI2/Get_entreprise.php")
       .success(function (response) {
            $scope.entreprise = response;
       });   
    
    $scope.memberSearchResult = function () {
        $scope.members = {};
        //http://localhost/chantrerieAPI2/Get_recherche.php
        var link = "https://chantrerie.000webhostapp.com/Get_recherche.php";
        //Conversion de date en string
        var datefilter1 = $filter('date');
        var datefilter2 = $filter('date');
        formattedDate1 = datefilter1($scope.dt1, 'yyyy-MM-dd');
        formattedDate2 = datefilter2($scope.dt2, 'yyyy-MM-dd');
        $http.post(link, {email : $scope.searchEmail, username: $scope.searchUsername, date1: formattedDate1, date2: formattedDate2}).then(function (response){
            if (response.data) {
                console.log(response.data);
                $scope.members = response.data;
                $scope.rechercheMembre();
            }
            
        });
    }
    
    
    /*Requêtes delete*/
    
    $scope.deleteEntreprise = function (event) {
        //http://localhost/chantrerieAPI2/Delete.php
        var link = "https://chantrerie.000webhostapp.com/Delete.php";
        var entreprise = event.target.id;
        $http.post(link, {company : entreprise, code: 'COMPANY'}).then(function (res){
                //http://localhost/chantrerieAPI2/Get_entreprise.php
                $http.get("https://chantrerie.000webhostapp.com/Get_entreprise.php")
                   .success(function (response) {
                        $scope.entreprise = response;
                   });
            });
    };
    
    $scope.deleteUser = function (event) {
        //http://localhost/chantrerieAPI2/Delete.php
        var link = "https://chantrerie.000webhostapp.com/Delete.php";
        var user = event.target.id;
        $http.post(link, {email : user, code: 'USER'}).then(function (res){
                $http.get("https://chantrerie.000webhostapp.com/Get_membres_derniers_inscrits.php")
                   .success(function (response) {
                        $scope.derniersInscrits = {};
                        $scope.derniersInscrits.data = response;
                   });
                $http.get("https://chantrerie.000webhostapp.com/Get_membres_derniers_connexions.php")
                   .success(function (response) {
                        $scope.derniersConnexions = {};
                        $scope.derniersConnexions.data = response;
                   });
            });
    };
    
    /*Requêtes désactiver*/
    
    $scope.disableUser = function (event) {
        var link = "https://chantrerie.000webhostapp.com/Disable.php";
        var user = event.target.id;
        $http.post(link, {email : user}).then(function (res){
               $http.get("https://chantrerie.000webhostapp.com/Get_membres_derniers_inscrits.php")
                   .success(function (response) {
                        $scope.derniersInscrits = {};
                        $scope.derniersInscrits.data = response;
                   });
                $http.get("https://chantrerie.000webhostapp.com/Get_membres_derniers_connexions.php")
                   .success(function (response) {
                        $scope.derniersConnexions = {};
                        $scope.derniersConnexions.data = response;
                   });
            });
    };
    
    /*Requêtes activation*/
    
     $scope.activateUser = function (event) {
        var link = "https://chantrerie.000webhostapp.com/Activate.php";
        var user = event.target.id;
        $http.post(link, {email : user}).then(function (res){
               $http.get("https://chantrerie.000webhostapp.com/Get_membres_derniers_inscrits.php")
                   .success(function (response) {
                        $scope.derniersInscrits = {};
                        $scope.derniersInscrits.data = response;
                   });
                $http.get("https://chantrerie.000webhostapp.com/Get_membres_derniers_connexions.php")
                   .success(function (response) {
                        $scope.derniersConnexions = {};
                        $scope.derniersConnexions.data = response;
                   });
                $http.get("https://chantrerie.000webhostapp.com/Get_membres_desactive.php")
                   .success(function (response) {
                        $scope.disableMembers = {};
                        $scope.disableMembers.data = response;
                   });
            });
    };
    

    /*Gestion des boitres modales*/
    $scope.listEtablissement = function () {  
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/listEtablissement.html',
          controller: 'MainCtrl'
          })
    };

    
    //liste qui contient tous les ng-model avec modified_content indexé par rapport à id de la table comments
    $scope.currID = {};
    $scope.modifierCommentaire = function (event) { 

        /*var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/modifierCommentaire.html',
          ariaLabelledBy: 'Modifier le commentaire',
          ariaDescribedBy: 'Entrez vos modifications',
          controller: 'MainCtrl'
          })*/
      $scope.date = newDate();
      var user = event.target.id;
      var link = "https://chantrerie.000webhostapp.com/ModifyComment.php";
      
      $http.post(link, {id : user, newcontent: $scope.currID[user], date: $scope.date}).then(function (res){
        

          $http.get("https://chantrerie.000webhostapp.com/Get_commentaires.php")
             .success(function (response) {   
                  $scope.commentaires = response;
             });
          });   


    };

    
    $scope.statistiques = function () {  
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/statistiques.html',
          controller: 'MainCtrl'
          })
    };
    $scope.rechercheMembre = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/rechercheMembre.html',
          controller: 'MainCtrl',
          scope: $scope,
          size: 'lg'
          })
    };
    $scope.showDisableMembers = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/membresDesactives.html',
          controller: 'MainCtrl',
          scope: $scope,
          size: 'lg'
          })
    };
    
    /*Gestion commentaires*/
    
    $scope.validComment = function (event) {

        var user = event.target.id;
        /*var mail = "";
        var con = "";
        var stop = false;
        for (var i = 0; i < user.length; i++) {
          if (user[i] != ',' && stop == false) {
            mail = mail + user[i];
          } else if (user[i] == ',') {
            stop = true;
          } else if (stop == true) {
            con = con + user[i];
          }
        }*/
   
        var link = "https://chantrerie.000webhostapp.com/ValidComment.php";
        
        $http.post(link, {id : user}).then(function (res){
                $http.get("https://chantrerie.000webhostapp.com/Get_commentaires.php")
                   .success(function (response) {
                    console.log(response);
                 
                        $scope.commentaires = response;
                   });
            });
      
    };
    
    $scope.deleteComment = function (event) {
        var link = "https://chantrerie.000webhostapp.com/DeleteComment.php";
        var user = event.target.id;
        $http.post(link, {email : user}).then(function (res){
             $http.get("https://chantrerie.000webhostapp.com/Get_commentaires.php")
                   .success(function (response) {
                        $scope.commentaires = response;
                   });
            });  
    };
    
    /*Date picker*/
  
  

  $scope.inlineOptions = {
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    formatMonth: 'mm',
    formatDay: 'dd',
    startingDay: 1
  };


  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };


  $scope.popup1 = {
    opened: false
  };
    
  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };


  $scope.popup2 = {
    opened: false
  };



});
