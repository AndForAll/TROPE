var angular = angular || {};

// Home Controller

angular.module('app.controller.home', [])
.controller('HomeCtrl', function($scope, $rootScope, socket, $location, GalleryParseService, $state, videoData,VideoFactory ) {
  //title
  $scope.socketmsg = "trope";
  // $scope.videos = $rootScope.global.videos;
  //test gallery
  // console.log('SEEING IF CREATION OF VIDEO OBJS WORKED');
  // console.log($rootScope.global.videos);

//UNCOMMENT FOR PARSE
  // $scope.videos = videoData;
  // console.log('Home controller saving videos to scope so we can load the gallery!');
  // console.log(videoData);
  // console.log($scope.videos);
  // //also save to rootscope for ease!
  // $rootScope.global.videos = videoData

  $scope.videos = $rootScope.global.newVideos;
  $rootScope.global.videos = $rootScope.global.newVideos;

  //SOCKET LISTENERS
  socket.on('init', function(data){
    console.log(data.msg);
    console.log(data.id);
    $rootScope.global.socket.id = data.id;
    console.log($rootScope.global.socket.id);
  });

  // M E T H O D S
  // when video is clicked
  // get the id of the vid so we know which one
  // redirect to play page of that id...on the way it will create a socket room

  $scope.playVideo = function(vidId){
    console.log('IT WAS CLICKED!!');
    console.log(vidId);
    // $location.path('/parent/'+vidId);
    $state.go('Gallery.play',{id: vidId});
  };

  // $scope.getFromParse = function() {
  //   GalleryParseService.getVideos(function(result){
  //     console.log('from home controller... not what we want');
  //     console.log(result);
  //   });
  // };

  // $scope.sendParse = function() {
  //   console.log('IN SEND PARSE IT"S BEEN CLICKED!!!!');
  //   console.log($rootScope.global.newVideos);
  //     GalleryParseService.createVideo($rootScope.global.newVideos[1],function(res){
  //       console.log(res);
  //     });
  //
  //   }

  // $scope.goGallery = function(){
  //   $state.go('Gallery.list');
  // }

  var getVideoIndex = function(id){
    console.log('getting the video we want to currently play');
    for(var i = 0; i <$rootScope.global.videos.length; i++) {
      if($rootScope.global.videos[i].id == id){
          $rootScope.global.currentVideo = $rootScope.global.videos[i];
          console.log('current video set at');
          console.log($rootScope.global.currentVideo);
      }
    }
  };


  //n is the number of characters we grab after the decimal...
  var createID = function(n) {
      return Math.random().toString(36).substr(2,n);
  };

});
