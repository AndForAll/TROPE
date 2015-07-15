var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 9001;
var MobileDetect = require('mobile-detect');
var device;

app.get('/',function(req,res,next){
    console.log('app get');
    var md = new MobileDetect(req.headers['user-agent']);
    console.log(md.ua);
if (md.ua.indexOf('iPhone') !== -1 || md.ua.indexOf('Android') !== -1) { // if mobile
        // redirect('public/mobile.html')
        console.log('motherfucking phone');
        
        device = 'm';
    } else { // if desktop
       // redirect('public/desktop.html');
       console.log('motherfucking desktop, boring.');

       device = 'd';
   };
      next(); 
});



app.use('/', express.static(__dirname + '/public'));

server.listen(port, function() {
    console.log('Server running at port:' + port);
});

var secret = 'lucySmells';

//START SOCKET CONNECTION
var videoUser = io.on('connection', function(socket) {

    if (device == 'm') { // if mobile
        socket.emit('device', {device: 'm'});
    } else { // if desktop
        socket.emit('device', {device: 'd'});
    };    

socket.on('load', function(data){
    console.log('client submited a key');
    socket.emit('access', {
        access: (data.key === secret ? "granted" : "denied")
    });

});

socket.on('frameChange', function(data){
    console.log('client is asking for frame change');
    // console.log('the hash taht the clieant sent is   ' + data.hash);
    console.log('the step taht the clieant sent is   ' + data.step);
    if(data.key === secret){
        videoUser.emit('navigate', {newStep: data.thisStep});
        console.log('user has right key now I tell them where to navigate based on hash they sent');
    }
});


});//END OF videoUser Socket

console.log('Your presentation is running on http://localhost:' + port);




