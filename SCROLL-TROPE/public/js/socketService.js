var angular = angular || {};

angular.module('app.socket', [])
  .factory('socket', function ($rootScope, vidUtils, $state) {
    // var socket = io.connect();
    //TO TEST LOCAL RUN WITH AMAZON SERVER
        var socket = io.connect('52.0.211.152:3000');
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      },
      //////WORKING
      CrteRm: function(data){
        if($rootScope.global.room == null){
        // console.log($rootScope.global.room);
        // console.log('null');

          var rmKey = vidUtils.createRmId(4);
          socket.emit('send:rmcreate', {
            data:data,
            rmKey:rmKey
          }, function(res) {
            console.log('callback');
            console.log(res);
            $rootScope.global.room = res;
            return res;
          });
        }else {
          return $rootScope.global.room;
        };
        // return rmKey;
      },
      // CrteRm: function(data){
      //   if($rootScope.global.room.length > 0){
      //     console.log('WE ALREADY HAVE A ROOM');
      //     return $rootScope.global.room;
      //   } else {
      //   var rmKey = vidUtils.createRmId(4);
      //   socket.emit('send:rmcreate', {
      //     data:data,
      //     rmKey:rmKey
      //   }, function(res) {
      //     console.log('callback');
      //     console.log(res);
      //     $rootScope.global.room = res;
      //     return res;
      //   });
      //   }
      //   // return rmKey;
      // },
      joinRm: function(data){
        // if($rootScope.global.room.length > 0){
        //   console.log('WE ALREADY HAVE A ROOM');
        //   return $rootScope.global.room;
        // }else{
          // $state.go('ERROR', {msg: });
          console.log('recieved room join req');
          console.log(data);
          socket.emit('send:joinRmReq', {
            data:data
          }, function(res){
            console.log(res);
            $rootScope.global.room = res;
            return res;
          });
      // }
    }
  };
  });
