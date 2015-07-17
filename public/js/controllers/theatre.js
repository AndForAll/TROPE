var angular = angular || {};

angular.module('app.controller.theatre', [])
.controller('TheatreCtrl', function($scope, $rootScope, $stateParams, preloader) {

  //testing something
  console.log($stateParams);

$scope.currentTrope = $rootScope.global.tropes[$stateParams.id];
console.log($scope.currentTrope);

$scope.from = 0
$scope.to = -1;
$scope.step = 1;
$scope.imgsrc = $scope.currentTrope.frames.paths[1];

$scope.scrolledStage = null;

/////////////////////////////////
// P R E      L O A D E R      //
/////////////////////////////////
$scope.isLoading = true;
$scope.isSuccessful = false;
$scope.percentLoaded = 0;

//FROM http://www.bennadel.com/blog/2597-preloading-images-in-angularjs-with-promises.htm
// Preload the images; then, update display when returned.
preloader.preloadImages( $scope.currentTrope.frames.paths ).then(
                   function handleResolve( imageLocations ) {

                       // Loading was successful.
                       $scope.isLoading = false;
                       $scope.isSuccessful = true;

                       console.info( "Preload Successful" );

                   },
                   function handleReject( imageLocation ) {

                       // Loading failed on at least one image.
                       $scope.isLoading = false;
                       $scope.isSuccessful = false;

                       console.error( "Image Failed", imageLocation );
                       console.info( "Preload Failure" );

                   },
                   function handleNotify( event ) {

                       $scope.percentLoaded = event.percent;

                       console.info( "Percent loaded:", event.percent );

                   }
               );



/////////////////////////////////
// S C O P E    M E T H O D S //
/////////////////////////////////
$scope.$on('scrolling', function($evt, a, locals) {

      $scope.scrolledStage = 'scrolling';

      $scope.$apply(function animloop() {
      console.log('SCROLLLLLLLLLL');
        //get the frame it should be on based on percentage
        $scope.targetStep = Math.round(locals.$progress * $scope.currentTrope.length);

        //change image directly
        if($scope.targetStep != $scope.step){
            $scope.step = $scope.targetStep;
            $scope.imgsrc = $scope.currentTrope.frames.paths[$scope.step];
            console.log($scope.step);
        }

      });
  }); // END OF SCROLLING


});
