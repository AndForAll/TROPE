var angular = angular || {};

// Home Controller

angular.module('app.controller.play', [])
.controller('PlayCtrl', function($scope, $rootScope, socket) {
  /////////////////////////////////
  // V A R S //
  /////////////////////////////////
  // $scope.$apply(function() {
    console.log($rootScope.global.currentVideo);
    console.log($rootScope.global.currentVideo.video.frames);

    $scope.from = 0
    $scope.to = -1;
    $scope.step = 1;

    $scope.scrolledStage = null;

    $scope.video = $rootScope.global.currentVideo;
    //set first img
    $scope.imgSrc = $scope.video.video.frames[$scope.step];
    $scope.imgSrcTitle = $scope.video.video.framesurl[1];
    console.log($scope.imgSrcTitle);

  // });

  /////////////////////////////////
  // S O C K E T   L I S T E N E R S //
  /////////////////////////////////

  socket.on('recieve:scroll', function(data) {
    console.log('recieved scroll step');
    console.log(data);
    console.log('from');
    console.log(data.type);
    console.log(data.id);

    // $scope.updateStep(data.step);
    // $scope.$apply(function() {
      if(data.step != $scope.step){
            $scope.step = data.step;
            $scope.imgsrc = $scope.video.video.frames[$scope.step];
        }
      // });

  });
  /////////////////////////////////
  // S C O P E    M E T H O D S //
  /////////////////////////////////
    $scope.$on('scrolling', function($evt, a, locals) {
        $scope.scrolledStage = 'scrolling';
        $scope.$apply(function animloop() {

          //get the frame it should be on based on percentage
          $scope.targetStep = Math.round(locals.$progress * $scope.video.length);

          //send target step to socket
          socket.emit('send:scroll', {

              type: 'desktop',
              id: $rootScope.global.socket.id,
              step: $scope.targetStep

          }, function(error,message){
              console.log(error);
              console.log(message);
          });

          // //change image directly
          // if($scope.targetStep != $scope.step){
          //     $scope.step = $scope.targetStep;
          //     $scope.imgsrc = $scope.frameImgs[$scope.step];
          // }

        });
    }); // END OF SCROLLING



});
