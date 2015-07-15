var angular = angular || {};

angular.module('app.router', [])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('Home', {
        abstract: true,
        url: '/',
        templateUrl: 'views/home.html',
        resolve: {
          videoData: function(GalleryParseService){
            console.log('in resolve!');
            return GalleryParseService.all();
          }
        },
        controller: 'HomeCtrl'
      })
      // .state('Play', {
      //   url: '/play',
      //   templateUrl: 'views/play.html',
      //   controller: 'PlayCtrl'
      // })
      .state('Home.gallery', {
        url: '',
        templateUrl: 'gallery/home.gallery.list.html'
      })

      .state('Gallery', {
        //abstract will mean this page doesn't actually ever show but it a placeholder for it's children
        abstract: true,
        // all the children will be prepended with this.. i.e. /gallery/list
        url: '/gallery',
        templateUrl: 'gallery/gallery.html',

        //resolve will complete dependencies before the controller is instansiated
        //so in our case we will make sure it finishes fetching all the data for the videos so our children can use them for playing and the list
        resolve: {
          videoData: function(GalleryParseService){
            console.log('in resolve!');
            return GalleryParseService.all();
          }
        },
        //controller
        //may want to refer to a larger controler later.. but for now just grabs the videos so we can populate
        controller: function($scope, $state, videoData, $rootScope){

          //add 'gallery-service' to the parent abstracts scope
          // all child state views will be able acces this!
          // $scope.videos = videoData;
          $scope.videos = $rootScope.global.newVideos;
          console.log('Gallery controller');
          console.log(videoData);
          console.log($scope.videos);

        }
      })

      .state('Gallery.list', {
        // as this is a child of gallery, making the url "" means this will show at /gallery
        url: '',
        //will be inserted in gallery's ui-view
        templateUrl: 'gallery/gallery.list.html'
        // ,controller:
      })

      //WORKS!!!!!!!!!
      // .state('Gallery.play', {
      //   url: '/{id}',
      //   views: {
      //     '': {
      //       templateUrl: 'gallery/gallery.video.html',
      //       resolve: {
      //         //this is mostly for a test.. should remove later...
      //         currentVideo: function($stateParams,GalleryParseService){
      //           console.log('in cuurent vid resolve!');
      //           console.log($stateParams);
      //           return GalleryParseService.all();
      //         }
      //         ,
      //         crteRm: function($stateParams,socket){
      //           // console.log('in crterm resolve');
      //           return socket.CrteRm($stateParams);
      //         }
      //       },
      //       controller: 'VPlayCtrl'
      //     },
      //     'overlay': {
      //       template: 'overlay'
      //     }
      //   }
      // })

      .state('Gallery.play', {
        url: '/parent/{id}/',
        views: {
          '': {
            templateUrl: 'gallery/gallery.video.html',
            resolve: {
              // //this is mostly for a test.. should remove later...
              // currentVideo: function($stateParams,GalleryParseService){
              //   console.log('in cuurent vid resolve!');
              //   console.log($stateParams);
              //   return GalleryParseService.all();
              // }
              // ,
              crteRm: function($stateParams,socket){
                // console.log('in crterm resolve');
                return socket.CrteRm($stateParams);
              }
            },
            controller: 'VPlayCtrl'
          },
          'overlay': {
            template: '<a ui-sref="Home.gallery"><img src="/media/assets/x.svg" class="home-btn"/></a>'
          }
          ,
          'remote_message': {
            templateUrl: 'views/video.remote.modal.html',
            controller: function($state, $scope, $stateParams, $rootScope,vidUtils){
              console.log('WE IN REMOTE MESSAGE');
              console.log($rootScope.global.room.id);
              console.log($scope.video);

              $scope.currentVideo = vidUtils.findById($scope.videos,$stateParams.id);
              $rootScope.currentVideo = $scope.currentVideo;

              // $scope.remoteUrl = 'http://localhost:3000/d/#/remote/remote?rmKey='+$rootScope.global.room.data+'&vid'+ $stateParams.id;
              $scope.remoteUrl = $rootScope.global.room.data;
              $scope.video = $rootScope.currentVideo;
              // http://localhost:3000/d/#/gallery/parent/ASH01
              console.log($scope.video);
              $scope.from = 0
              $scope.to = -1;
              $scope.step = 1;
            }
          }
        }
      })

      .state('Gallery.remote', {
        url: '/r/r?rmKey&vid',
        templateUrl: 'gallery/gallery.video.html',
        resolve: {
          join: function($stateParams,socket){
            return socket.joinRm($stateParams);
          }
        },
        controller: 'VRPlayCtrl'
      })

      // .state('Gallery.play', {
      //   url: '/parent',
      //   template: ' ',
      //   resolve:{
      //     crteRm: function($stateParams,socket){
      //       // console.log('in crterm resolve');
      //       return socket.CrteRm($stateParams);
      //     }
      //   },
      // })

      // //we should send the phone through a url like this.
      // .state('Test',{
      //   url:'/test/data?rmKey&d',
      //   templateUrl : 'gallery/gallery.video.html',
      //   controller: function($scope, $stateParams){
      //         console.log($stateParams);
      //       }
      // })

      // .state('Gallery.play.remote',{
      //   url:'/remote/remote?rmKey',
      //   template: ' ',
      //   resolve:{
      //     join: function($stateParams,socket){
      //       return socket.joinRm($stateParams);
      //     }
      //   },
      //   controller: function($stateParams, socket, $scope, $state) {
      //     console.log($stateParams);
      //     // $state.go('^', $stateParams.vId);
      //   }
      // })

      .state('ERROR', {
        url: '/error/{msg}',
        templateProvider: function($stateParams){
          return '<h1>ERROR:</h1></br><h2>'+$stateParams.msg+'</h2>'
        }
      })

      //STUFF FOR PHONE!!!
      .state('PhoneHome', {
        abstract: true,
        url: '/m',
        template: '<div ui-view></div>'
      })

      .state('PhoneHome.home', {
        url: '',
        templateUrl: 'mobile/mhome.html',
        resolve: {
          videoData: function(GalleryParseService){
            console.log('in resolve!');
            return GalleryParseService.all();
          }
        },
        controller: 'MHomeCtrl'
      })

      .state('PhoneHome.Remote', {
        url: '/r',
        templateUrl: 'mobile/remoteInpt.html',
        controller: 'phoneHmInpt'
      })

      .state('PhoneHome.play', {
        url: '/p/p?rmKey&vid',
        templateUrl: 'mobile/mobile.play.html',
        controller: function($scope, $rootScope, $stateParams, socket, vidUtils){

          $scope.currentVideo = vidUtils.findById($scope.videos,$stateParams.vid);

          $scope.from = 0
          $scope.to = -1;
          $scope.step = 1;
          $scope.imgsrc = $scope.currentVideo.video.frames[$scope.step];

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

                      type: 'phone',
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

        }
      })

      // Set default state
    $urlRouterProvider.otherwise('/');
  });
