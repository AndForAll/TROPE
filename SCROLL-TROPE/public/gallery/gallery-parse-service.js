//eventually this will pull from parse or something...
var angular = angular || {};

angular.module('app.gallery.parse-service', [])
.factory('GalleryParseService', function() {
  //create new subclass of Parse.object
  var VideoData = Parse.Object.extend("VideoData");
  //create a new instance of that class
  var videoData = new VideoData();
  var query = new Parse.Query("VideoData");
  var service = {};

  // var videos = function() {
  //   query.find({
  //     success: function(res){
  //       return res;
  //     }, error: function(err){
  //       return err;
  //     }
  //   })
  // };


  service.createVideo = function(video, cb){
    //save our new data
    videoData.save({
      title: video.title,
      subtitle: video.subtitle,
      description: video.description,
      length: video.length,
      createdBy: video.createdBy,
      vidId: video.id,
      video: video.video,
      srcpadding: video.srcpadding,
      fileprefix: video.fileprefix,
      frameRate: video.frameRate
    },{
      success: function(result){
        console.log(result);
        cb(result);
      },
      error: function(err){
        console.log(err);
        cb(err);
      }
    })
  };

  service.all = function() {
    // console.log('service all has been called');
    return query.find({
      success: function(res){
        // console.log(res);
        return res;
      }, error: function(err){
        // console.log(err);
        return err;
      }
    })
  };

  // service.getVideos = function() {
  //   var videos;
  //   query.find({
  //     success: function(res){
  //       videos = res;
  //       console.log('from parse serv');
  //       console.log(videos);
  //       console.log(res);
  //     }, error: function(err){
  //       videos = err;
  //     }
  //   })
  // };

  // service.all = function() {
  //   query.get({
  //     success: function(result){
  //       console.log(result);
  //       return result;
  //     },
  //     error: function(object,error){
  //       console.log(error);
  //       return error;
  //     }
  //   });
  // };

  // service.getVideos = function(cb) {
  //   query.find({
  //     success: function(res){
  //       cb(res);
  //     }, error: function(err){
  //       cb(err);
  //     }
  //   })
  // };

  //
  // var videos = getVideos(function(res){
  //   console.log(res);
  //   return res;
  // });

  return service;
});
