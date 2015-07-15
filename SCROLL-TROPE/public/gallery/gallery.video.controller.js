var angular = angular || {};

angular.module('app.gallery.controller', [])
.controller('VPlayCtrl', function($scope, $rootScope, socket, $stateParams, vidUtils, crteRm) {
    //just test we can get params out of url first
    // $scope.video =
    $scope.currentVideo = vidUtils.findById($scope.videos,$stateParams.id);
    // $scope.currentVideo = videoData;
    // console.log($scope.currentVideo);
    // console.log($scope.videos);
    // console.log($stateParams);
    // console.log(crteRm);
    console.log($rootScope);
    console.log($stateParams);
    // console.log('this is what was returned for creates room');
    // console.log(crteRm);

    // socket.on('send:rmSuccess', function(res){
    //   console.log(res);
    // });


    $scope.from = 0
    $scope.to = -1;
    $scope.step = 1;
    $scope.imgsrc = $scope.currentVideo.video.frames[1];

    $scope.scrolledStage = null;

    socket.on('send:scrolltorm', function(data){
      console.log(data.data.step);
      if(data.data.step != $scope.step){
            $scope.step = data.data.step;
            $scope.imgsrc = $scope.currentVideo.video.frames[$scope.step];
        }
    });

    //to test if I am now in the room
    /////////////////////////////////
    // S C O P E    M E T H O D S //
    /////////////////////////////////
    $scope.$on('scrolling', function($evt, a, locals) {
          $scope.scrolledStage = 'scrolling';
          $scope.$apply(function animloop() {

            //get the frame it should be on based on percentage
            $scope.targetStep = Math.round(locals.$progress * $scope.currentVideo.length);

            //send target step to socket
            socket.emit('send:scrollrm', {

                type: 'desktop',
                id: socket.id,
                step: $scope.targetStep,
                rmKey: $rootScope.global.room.data

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

    //we need to create a modal that comes up on load that has the phone connection info

});
