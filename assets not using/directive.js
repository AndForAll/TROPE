var angular = angular || {};

angular.module('app.directive', [])
.directive('scroll', function ($window) {
  return {
    link: function(scope, element, attr) {
        console.log('in directive');
        angular.element($window).bind('scroll', function() {
          //page offset
        console.log(this.pageYOffset);

        scope.$apply();
      });
    }
  };


});
