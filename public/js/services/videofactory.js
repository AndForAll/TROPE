var angular = angular || {};

//eventually a service will be better for this as it is almost class based
//there fore when we pull from where ever we have imgs and data saved
//some stuff can be standardized...

angular.module('app.vidfactory', [])
.factory('VideoFactory', function() {
  return {
    getFrames: function(id, length, padding, prefix ,frameRate) {

      var frames = {};
      frames.large = [];
      frames.sizedthesis = [];


      for(var i = 1; i <= length; i++){
        // images[i] = new Image();
        // frames.frames[i] = "../media/frames_"+id+"/"+prefix+pad(i, padding)+".jpg";
        // frames.paths[i] = "../media/frames_"+id+"/"+prefix+pad(i, padding)+".jpg";
        // frames.framesurl[i]= "http://localhost:3000/media/frames_"+id+"/"+prefix+pad(i, padding)+".jpg";

        ///THIS ONE BELOW DOES WORK BUT I"M REMOVING LARGE IMAGES FOR MEMORY REASONS.....
        // frames.large[i]="http://media.trope.cc/large/frames_"+id+"/"+ prefix + pad(i, padding)+".jpg";
        //http://media.trope.cc/sized-thesis/frames_{{ID}}/image_{{FRAME_NUMBER}}.png
        frames.sizedthesis[i]="http://media.trope.cc/sized-thesis/frames_"+id+"/"+ prefix + pad(i, padding)+".png";

      }
      frames.params = (frames.sizedthesis.length-1) * frameRate;
      return frames;
    }
  }

  function pad(number, length) { // pad numbers with leading zeros for JPEG sequence file names
    var str = '' + number; while (str.length < length) { str = '0' + str; } return str;
  }

});
