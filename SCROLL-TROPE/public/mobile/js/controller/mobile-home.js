var angular = angular || {};

// Home Controller for mobile

angular.module('app.controller.mobile-home', [])
.controller('MHomeCtrl', function($scope, $rootScope, $state,GalleryParseService, videoData ) {
  $scope.socketmsg = 'TROPE';
  // $rootScope.videos = videoData;
  $rootScope.videos = $rootScope.global.newVideos;
  $scope.videos = $rootScope.global.newVideos;

  console.log($rootScope.videos);


  $scope.goGallery = function(){
    console.log('CLICKED GOOOOOO GALLERY!!');
  };

  $scope.goRemote = function(){
    console.log('CLICKED GOOOOOO REMOTE!');
    $state.go('PhoneHome.Remote'); //WORKSSSSS

  };

});
