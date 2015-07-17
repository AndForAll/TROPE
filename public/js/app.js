var angular = angular || {};

// Our main JavaScript file
// Init Angular world by linking to 'myApp' namespace we declared in <body>
// in [ ], we add any dependencies used for the project
// `ui.router` is reserved by ui.router library

angular.module('myApp', ['ui.router',
  'app.router',
  //C O N T R O L L E R S
  'app.controller.home',
  'app.controller.theatre',
// //S E R V I C E S
  'app.vidfactory',
  'app.preloader.factory',
//   'app.vidUtils',
//   //////E X T R A S
  'pc035860.scrollWatch'
])

  //IF WE WANT TO USE AN ANGULAR VARIABLE OR A SERVICE WE HAVE MADE
  //WE WRITE THE NAME OF IT IN THE FUNCTION()
  // HERE WE HAVE VIDEOFACTORY BECAUSE I WANT TO USE MY VIDEOFACTORY METHODS IN THIS FUNCTION
//,VideoFactory
  .run(function($rootScope,$state, $stateParams, VideoFactory) {
    console.log('WE RUN RUN RUN');

    //create a global rootscope object so we can keep track of various things
    //these can be accessed by the whole application
    $rootScope.global = {};
    $rootScope.global.currentVideo = {};
    //FAKING A DATA BASE FOR NOOOOOOWWWW
    $rootScope.global.tropes = [{
        title: 'YOGA' ,
        subtitle: '',
        description: '' ,
        length: 2697,
        // length: 2500,
        createdBy: '',
        id: 'YOGA01',
        frames: {},
        srcpadding: 6,
        fileprefix: 'image_',
        frameRate: 24
      },{
          title: 'FREE THROW' ,
          subtitle: '',
          description: '' ,
          length: 490,
          createdBy: '',
          id: 'ASH01',
          frames: {},
          srcpadding: 6,
          fileprefix: 'image_',
          frameRate: 24
      },{
        title: 'BURY' ,
        subtitle: '',
        description: '' ,
        length: 1955,
        createdBy: 'CHEN',
        id: 'BURY02',
        frames: {},
        srcpadding: 6,
        fileprefix: 'image_',
        frameRate: 24
      },{
        title: 'KINETIC' ,
        subtitle: '',
        description: '' ,
        length: 48,
        createdBy: '',
        id: 'BURY01',
        frames: {},
        srcpadding: 6,
        fileprefix: 'image_',
        frameRate: 100
      },{
        title: 'BLINK BLINK' ,
        subtitle: '',
        description: '' ,
        length: 6168,
        createdBy: '',
        id: 'BB01',
        frames: {},
        srcpadding: 6,
        fileprefix: 'image_',
        frameRate: 24
      } ];

  // //here we use the videofactory service we made so we can get
  // //the paths to all the img urls and other info we need
  for(var i = 0; i < $rootScope.global.tropes.length; i++){
    var trope = $rootScope.global.tropes[i];
    $rootScope.global.tropes[i].frames = VideoFactory.getFrames(trope.id,trope.length,trope.srcpadding,trope.fileprefix,trope.frameRate);
  }
  console.log('THESE ARE THE TROPES');
  console.log($rootScope.global.tropes);

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

});
