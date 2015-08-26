var angular = angular || {};

angular.module('app.router', [])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('Home', {
        abstract: true, //meaning we can never just go to "home" it will be "home.gallery" etc...
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })

      .state('Home.gallery', {
        url: '',
        templateUrl: 'views/home.gallery.html'
      })

      //WE TAKE IN AN 'ID' IN THE URL HERE
      //THIS WAY WHEN WE CLICK A TROPE FROM THE GALLERY WE GO TO WWW.TROPE.CC/BURY
      //THEN WHEN WE LOAD THE THEATRE STATE WE CAN GRAB THAT ID AND FIGURE OUT WHICH TROPE TO PLAY!
      //SO GOTTA TAKE PARAMS IN THEATRECTRL
      .state('Theatre', {
        abstract: true,
        url: '/{id}',
        templateUrl: 'views/theatre/theatre.html',
        controller: 'TheatreCtrl'
      })

      //NAMED 'MAIN' AS IN THE FUTURE WILL HAVE
      //'CHILD'(VIEW ONLY) & 'REMOTE'(TO CONTROLL FROM OTHER BROWSERS DEVICES)
      //////////////////////////
      //THIS STATE HAS TWO 'VIEWS' IE. TWO PLACES FOR TEMPLATES
      //THE FIRST IS FOR THE FRAMES - IT HAS A HTML FILE AND POSS A controller
      //SECOND IS OVERLAYS - THIS WILL HAVE A HTML FILE AND A controller
      /////////////////////////
      //THE PARENT THEATRE'S CONTROLLER 'TheatreCtrl' WILL MOVE LIKELY DO MOST OF THE CHANGES FOR
      //FRAMES & OVERLAYS BY PASSING CHANGED VALUES ONTO IT'S CHILDREN

      .state('Theatre.main', {
        url: '/m', //at some point could put a var like with id in this url to toggle overlays on and off
        views: {
          '': {
            templateUrl: 'views/theatre/theatre.frames.html'
          },
          'overlay': {
            templateUrl: 'views/theatre/theatre.overlay.html'
          }
        } //end of views
      })

      // Set default state
    $urlRouterProvider.otherwise('/');
});
