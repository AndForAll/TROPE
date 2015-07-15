//This script is to test saving img files to parse


//npm install node-parse-api

//these are the keys for the Video-Trope
var Parse = require('node-parse-api').Parse;
// var Image = require('parse-image');
// var P = require('parse');
var fs = require('fs');

var APP_ID = 'WelYgUlrWQsr6vG6ZyFVyyXneYiJkVGnlq5Tru3L';
var MASTER_KEY= 'rynPqFVYvJZjMIygzmQwGGeh3OxnTYVYxUCugMWg';

var parse_app = new Parse(APP_ID, MASTER_KEY);

//THIS IS THE HARDCODED VERSION OF THE INFO
//EVENTUALLY THE INFO IN THE VIDEO OBJECT
//WILL BE OBTAINED THROUGH CREATION MODE

var videoObj = {
  title: 'Blink Blink: Your First Circuit!' ,
  description: 'Learn how to create a basic LED circuit using alligator clips and a coin cell battery, with Blink Blinks Helpful Hints!' ,
  length: 426
}

  // //first we want to create the "video" entry
  // //this will contain the video's info
  // iff success we get resp w/ objectId .. we use this to create frames class
  // called [objectID]_frames
  parse_app.insert('VideosLocal',{
     title: videoObj.title
    ,description: videoObj.description
  }, insertFrames);

  //function to insert frames // THIS VERSION IS JUST FOR LOCAL FILES
  function insertFrames(err,response){
      if(err){
        console.log(err);
      }else {
        console.log(response);
        //yay success so now we create frames class
        var objectId = response.objectId;
        var framesClass = response.objectId + '_frames';
        var frames = [];
          //we want to add all frames so need a for loop
          // <= videoObj.length
          for(var i = 1; i <= 4; i++){
            if(i < 10){
              var fileName = 'frame_00'+i+'.jpg';
              console.log(fileName);
            }else if(i >= 10 && i < 100){
              var fileName = 'frame_0'+i+'.jpg';
              console.log(fileName);
            }else{
              var fileName = 'frame_'+i+'.jpg';
              console.log(fileName);
            }

            var path = 'frames/'+fileName;
            frames[i]= path;

          }

          parse_app.insert(framesClass, {
            frames: frames,
            video: objectId
          });
        }
  }

  // ,objectId: objectId
  // pointer! -- trying relation first
  // ,frames: {
  //   __type: 'Relation',
  //   className: framesClass
  //   // ,objectId:
  // }

// };

// fs.readFile(path, function(err, data){
//   if(err){console.log(err);
//   }else {
//     imgFile = data;
//     console.log(data);
//           parse_app.insertFile(fileName, imgFile, 'image/jpeg',function(err, response){
//
//             if(err){
//               console.log('ERROR');
//               console.log(err);
//             }else{
//               console.log('SUCCESS');
//               console.log(response);
//               parse_app.insert('frames', {__type: 'File', "name": response.name}, function(err, response){
//                 if(err){
//                   // console.log(err);
//                 }else{
//                   // console.log(response);
//                 }
//               });
//             }
//
//
//           });
//   }
// });

// imgFile = Array.prototype.slice.call(new Buffer(imgFile), 0);

// parse_app.insertFile(fileName, imgFile, 'image/jpeg',function(err, response){
//
//   if(err){
//     console.log('ERROR');
//     console.log(err);
//   }else{
//     console.log('SUCCESS');
//     console.log(response);
//     parse_app.insert('frames', {__type: 'File', "name": response.name}, function(err, response){
//       if(err){
//         // console.log(err);
//       }else{
//         // console.log(response);
//       }
//     });
//   }
//
//
// });

// // upload file to parse
// parse_app.insertFile('file name', 'data', 'contentType', function(err, response){
//   if(err){
//     console.log(err);
//   }else {
//     //insert new object with the link to the new file...
//
//   }
// });
