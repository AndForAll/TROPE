var angular = angular || {};

// Home Controller

angular.module('app.controller.home', [])
.controller('HomeCtrl', function($scope, $rootScope, $state) {

  //We arent pulling from parse or anything right now
  //so getting the info for the tropes we defined in app.js
  //and assigning them to var in this scope.. the reason why we aren't just using the rootScope var
  //is so that when we do pull from a data base the code in this controller is still just referring to a
  //variable that only exsists within this scope's controller, so we won't have to change any of this code but this one line
  //we will use this info to populate the trope gallery

  $scope.tropes = $rootScope.global.tropes;

  // M E T H O D S

});
