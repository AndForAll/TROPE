var angular = angular || {};

//eventually a service will be better for this as it is almost class based
//there fore when we pull from where ever we have imgs and data saved
//some stuff can be standardized...

angular.module('app.vidfactory', [])
.factory('VideoFactory', function() {
  return {
    getVideo: function(id, length, padding, prefix,frameRate) {

      var video = {};
      video.frames = [];
      video.framesurl = [];

      for(var i = 1; i <= length; i++){
        // images[i] = new Image();
        // video.frames[i] = "../media/frames_"+id+"/"+prefix+pad(i, padding)+".jpg";
        video.frames[i] = "../media/frames_"+id+"/"+prefix+pad(i, padding)+".jpg";
        // video.framesurl[i]= "http://localhost:3000/media/frames_"+id+"/"+prefix+pad(i, padding)+".jpg";
      }
      video.params = (video.frames.length-1) * frameRate;
      return video;
    }
  }

  function pad(number, length) { // pad numbers with leading zeros for JPEG sequence file names
    var str = '' + number; while (str.length < length) { str = '0' + str; } return str;
  }

});
