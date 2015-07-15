var angular = angular || {};

// Home Controller

angular.module('app.controller.playSocketv', [])
.controller('PlayCtrl', function($scope, $rootScope, VideoFactory) {
  // call videoInfo factory
  // to get title frames etc...
  $scope.frameImgs = VideoFactory.getFrames();
  console.log($scope.frameImgs);
  //how many steps there are
  $scope.from = 0
  $scope.to = -1;
  $scope.step = 1;

  //how big the scroll stage needs to be
  $scope.scrollHeight = ($scope.frameImgs.length-1) * 24;

  $scope.scrolledStage = null;
  $scope.videoLength = $scope.frameImgs.length;
  //set the first image in place
  $scope.imgsrc = $scope.frameImgs[$scope.step];

  //when a scroll happens do this
    $scope.$on('scrolling', function($evt, a, locals) {
      $scope.scrolledStage = 'scrolling';
        $scope.$apply(function animloop() {

          console.log(locals.$percentage);
          console.log(locals.$progress * $scope.videoLength);
          console.log(Math.round(locals.$progress * $scope.videoLength));

          //get the frame it should be on based on percentage
          $scope.targetStep = Math.round(locals.$progress * $scope.videoLength);

          //change image
          if($scope.targetStep != $scope.step){
              $scope.step = $scope.targetStep;
              $scope.imgsrc = $scope.frameImgs[$scope.step];
          }

        });
    });

});
