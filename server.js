/*

TROPE

This version of trope is it's base interaction, no remote, just scrolling to video scrub

*/

var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
//joining socket & express so we can run through same port
var io = require('socket.io')(server);
//for module way that was kinda working
// var socket = require('./modules/socket.js');

var mobileDetect = require('mobile-detect');
//currently the amazon web server that we are going to use re-routes port 3000 to port 80 / https
var port = 3000;
var rooms = [];
//to do post request etc... may not need this in the end.
// app.use(bodyParser.urlencoded({
//     extended: false
// }));
// app.use(bodyParser.json());
// app.use(function(req, res, next) {
//     // Setup a Cross Origin Resource sharing
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     // console.log('incoming request from ---> ' + ip);
//     // Show the target URL that the user just hit
//     var url = req.originalUrl;
//     console.log('### requesting ---> ' + url);
//     next();
// });

//point express server to our client side



server.listen(port, function() {
    console.log('Server running at port:' + port);
});

var device;

//serve static content of libs and media so we can serve it to both the mobile app and the web app
// app.use('/m',express.static(__dirname + '/mobile'));

// app.use('/d', express.static(__dirname + '/public'));
app.use('/d', express.static(__dirname + '/public'));
app.use('/media', express.static(__dirname + '/public/media'));
app.use('/lib', express.static(__dirname + '/public/lib'));


app.get('/', function(req, res, next) {
  // app.use('/', express.static(__dirname + '/public'));
  var md = new mobileDetect(req.headers['user-agent']);
  var ua = JSON.stringify(md.ua);
  console.log(ua);
  //redirect to mobile site if mobile
  if(ua.indexOf('iPhone') !== -1 || md.ua.indexOf('Android') !== -1 ){
            //if mobile
            console.log('A PHONE HAS CONNECTED');
            // console.log(socket.id);
            device = 'm';
            res.redirect('d/#/m');

        }
        else {
            //if desktop
            console.log('A COMPUTER HAS CONNECTED');
            // console.log(socket.id);
            device = 'd';
            // res.redirect('/home');
            // res.location('/home');
            // res.redirect('/#/');
            // res.redirect('d');
            // res.redirect('desktop.html');
            res.redirect('d/#/');
        }


});

//this is to recieve incoming requests from the phone / computer connection code
// sent through the url
// app.get('/m*', function(req, res, next) {
//   // console.log(req);
//   console.log(req.url);
//   console.log(req.url.length);
//   // console.log(req.route);
//
//
//   //send to home page if know connect code is included in the url
//   if(req.url.length > 7){
//     //if there are 6 in the url we know we have a room code
//     //we want eventually redirect to a mobile state that pulls the
//     //rmKey sends to socket,
//     // var keys = req.url.split('-');
//     // console.log(keys);
//
//
//     var keys = req.url.slice(2);
//     console.log(keys);
//     var vidId = keys.slice(4);
//     var rmKey = keys.slice(0,4);
//     console.log(vidId);
//     console.log(rmKey);
//     res.redirect('d/#/gallery/remote/remote?rmKey='+rmKey+'&vid='+vidId);
//   }else{
//     //redirect to mobile site
//     res.redirect('d/#/');
//   }
// });

/*
S O C K E T

- listening for connection
- always start w/ connection; everything happens within this scope

*/
//for module way that was kinda working
// io.sockets.on('connection', socket);

io.on('connection', function(socket){
/*––––––––––– SOCKET.IO starts here –––––––––––––––*/

    /*
    .on
    .emit
    .broadcast
    */
    console.log('connected');



    // console.log('can I get io here?');
    // console.log(socket);

    console.log('socket id:'+ socket.id +'connected');

    //GREET NEW CONNECTION & SEND THEM THEIR SOCKET-ID
    socket.emit('init', {
      msg: 'GREETINGS FROM SERVER NEW CLIENT',
      id: socket.id
    });

    socket.on('send:scroll', function(data, callback){
      console.log('recieved scroll step');
      console.log(data.step);
      console.log('from');
      console.log(data.type);
      console.log(data.id);
        socket.emit('recieve:scroll', {
          type: data.type,
          id: socket.id,
          step: data.step
        });
      callback('error',socket.id);
    });



    socket.on('send:scrollrm', function(data, callback){
      console.log('recieved scroll step');
      console.log(data.step);
      console.log('from');
      console.log(data.type);
      console.log(socket.id);
      console.log(data.rmKey);
        // socket.emit('recieve:scroll', {
        //   type: data.type,
        //   id: socket.id,
        //   step: data.step
        // });
        io.to(data.rmKey).emit('send:scrolltorm', {
          msg: 'SCROLL',
          data:data
        });
      callback('error',socket.id);
    });

    //RECIEVE MESSAGE FROM DESKTOP TO CREATE ROOM
    socket.on('send:rmcreate', function(data,callback){
      console.log(data);
      //first lets see if this client is already in a room
      var result = findInRm(socket.id);
      if(result.length > 0){
        console.log('WE ALREADY IN A ROOM');
        console.log(findInRm(socket.id));
        callback({
          id:socket.id,
          msg:'this desktop is already connected to a rm',
          data: findInRm(socket.id)
        });
      }else{
        //create a new room!
        var roomObj = {
          id: data.rmKey,
          desktop: {
            id: socket.id
          },
          remote: {},
          currentVideo: data.data
        }

        //add it to the rooms array
        rooms.unshift(roomObj);
        //join to the room
        socket.join(data.rmKey);
        console.log('NEW DESKTOP CREATED ROOM');
        console.log(rooms);

        callback({
          id:socket.id,
          msg:'CONNECTED SOCKET TO ROOM!',
          data: data.rmKey
        });
        //NOT SURE IF WORKING
        // socket.to(data.rmKey).emit('send:rmSuccess', {
        //   msg: 'SUCCESSFULLY CREATED AND JOINED ROOM'
        // });
      }
    });

    socket.on('send:joinRmReq', function(data, callback){
      console.log('THIS IS WHAT YOU ARE LOOKING FOR');
      console.log(data.data.rmKey);
      console.log(rooms);
      console.log(data);

      if( findRm(data.data.rmKey) == null){
        callback({msg:'ERROR ROOM DOESN"T EXSIST'});
      } else {
        //join that socket
        socket.join(data.data.rmKey);
        //add it to the array
        // rooms[i].remote = {
        //   id: socket.id
        // };
        console.log(rooms);
        callback({
          id:socket.id,
          msg:'CONNECTED SOCKET TO ROOM!',
          data: data.data.rmKey
        });

        var videoId = findRm(data.data.rmKey);
        videoId = videoId.currentVideo.id;

        //send message back to client
        socket.emit('successful:roomjoin', {
          msg:'SUCCESS',
          rmKey: data.data.rmKey,
          videoId: videoId
        });
      };
    });

    // FUNCTIONS
    // //////////////////////////////////////
    var findInRm = function(id){
      for(var i =0; i < rooms.length; i++){
        if(rooms[i].desktop.id == id){
          return rooms[i];
        }

      }
      return 0;
    };

    var findRm = function(id){
      for(var i =0; i < rooms.length; i++){
        if(rooms[i].id == id){
          return rooms[i];
          // return i;
        }
      }
      return null;
    };

    var createKey = function(n){
      return Math.random().toString(36).substr(2,n);
    };

  }); // E N D  O F  S O C K E T CONNECT
