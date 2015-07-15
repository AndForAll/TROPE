var angular = angular || {};

// Our main JavaScript file
// Init Angular world by linking to 'myApp' namespace we declared in <body>
// in [ ], we add any dependencies used for the project
// `ui.router` is reserved by ui.router library

angular.module('myApp', ['ui.router',
  'pc035860.scrollWatch',
//splash sections
  'app.router',
  'app.controller.home',
  'app.controller.play',
//services
  'app.vidfactory',
  'app.socket',
  'app.gallery.parse-service',
//gallery
  // 'app.gallery.router'
  'app.gallery.controller',
  'app.vidUtils',
  'app.gallery.remote.controller',
  //////PHONE
  'app.controller.mobile-home',
  'app.controller.phoneInpt'
  // ,
  // 'ngMaterial',
  // 'ngAnimate',
  // 'ngAria'
])

  .run(function($rootScope,VideoFactory,GalleryParseService, $state, $stateParams) {
    console.log('WE RUN RUN RUN');

    //init parse
    //appID, javscriptId, masterKey
    Parse.initialize("WelYgUlrWQsr6vG6ZyFVyyXneYiJkVGnlq5Tru3L","FyCT84gpMBKZrXNoWh7a22st4qcJA8ovv3wYwy1r");

    //create a global rootscope object so we can keep track of various things
    $rootScope.global = {};
    $rootScope.global.socket = {};
    // $rootScope.global.currentVideo.index = 0;
    $rootScope.global.currentVideo = {};
    $rootScope.global.newVideos = [{
    title: 'BURY' ,
    subtitle: '',
    description: '' ,
    length: 1955,
    createdBy: 'CHEN',
    id: 'BURY02',
    video: {},
    srcpadding: 6,
    fileprefix: 'image_',
    frameRate: 24
  },{
    title: 'YOGA' ,
    subtitle: '',
    description: '' ,
    length: 2697,
    // length: 2500,
    createdBy: '',
    id: 'YOGA01',
    video: {},
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
    video: {},
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
    video: {},
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
    video: {},
    srcpadding: 6,
    fileprefix: 'image_',
    frameRate: 24
  }];

  console.log('THESE ARE THE VIDEOS');
  for(var i = 0; i < $rootScope.global.newVideos.length; i++){
    var vid = $rootScope.global.newVideos[i];
    $rootScope.global.newVideos[i].video = VideoFactory.getVideo(vid.id,vid.length,vid.srcpadding,vid.fileprefix,vid.frameRate);
  }
  console.log($rootScope.global.newVideos);

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

});
