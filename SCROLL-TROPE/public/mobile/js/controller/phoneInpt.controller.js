var angular = angular || {};

// Home Controller

angular.module('app.controller.phoneInpt', [])
.controller('phoneHmInpt', function($scope, $rootScope, socket, $location, GalleryParseService, $state ) {

  //WORKSSSSSSSSSS
  $scope.enterKey = function(key){
    console.log(key);
    //then we need to send to server via socket and see if that room exsists ...
    //putting the key one layer in so matches the desktop version on connecting to room.. i'm lazy
    var data = {
      rmKey: key
    };
    socket.joinRm(data , function(res){
      console.log('RESPONSE FROM SOCKET');
      console.log(res);
    });
  };

  socket.on('successful:roomjoin', function(data){
    console.log('FROM SOCKET');
    console.log(data);
    // $state.go('Gallery.remote', {rmKey: data.rmKey, vid: data.videoId}); //////WORKS
    $state.go('PhoneHome.play', {rmKey:data.rmKey , vid: data.videoId});
  });

});
