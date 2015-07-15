var angular = angular || {};

angular.module('app.gallery.router', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('Gallery', {
    //abstract will mean this page doesn't actually ever show but it a placeholder for it's children
    abstract: true,
    // all the children will be prepended with this.. i.e. /gallery/list
    url: '/gallery',
    templateUrl: 'gallery/gallery.html',

    //resolve will complete dependencies before the controller is instansiated
    //so in our case we will make sure it finishes fetching all the data for the videos so our children can use them for playing and the list
    // resolve: {
    //   GalleryParseService: ['GalleryParseService',
    //   function(GalleryParseService){
    //     //call the function from the gallery service to get all videos
    //     GalleryParseService.getVideos(function(result){
    //       console.log('resolve');
    //       console.log(result);
    //       return result;
    //     });
    //   }]
    // },
    //controller
    //may want to refer to a larger controler later.. but for now just grabs the videos so we can populate
    controller: ['$scope', '$state', 'GalleryParseService',
    function($scope, $state, GalleryParseService){

      //add 'gallery-service' to the parent abstracts scope
      // all child state views will be able acces this!
      GalleryParseService.getVideos(function(result){
        console.log('FROM GALLERY CONTROLLER WELL DONE');
        console.log(result);
      });

    }]
  })

  .state('gallery.list', {
    // as this is a child of gallery, making the url "" means this will show at /gallery
    url: '',
    //will be inserted in gallery's ui-view
    templateUrl: 'gallery/gallery.list.html'
    // ,controller:
  })

  // .state('gallery.play', {
  //   url: '/:id',
  //   views: {
  //     '': {
  //       templateUrl: 'gallery.video.html',
  //       controller: 'GalleryCtrl'
  //     },
  //     'textOverlay': {
  //       templateUrl: 'gallery.overlay.html',
  //       controller:
  //     }
  //   }
  // })

});
