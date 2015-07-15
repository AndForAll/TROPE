/*

SCROLL THRU
- This is a web app that connects a phone and desktop; 
so the phone can be used as a controller for the desktop video

*/

var express = require('express');
var app = express();
var server = require('http').Server(app);
//joining socket & express so we can run through same port
var io = require('socket.io')(server);
var mobileDetect = require('mobile-detect');
var port = 9000;

/*
FUNCTION TO DISCOVER DEVICE TYPE
*/

    app.get('/', function(req, res, next){
        console.log('getting device type');
        var md = new mobileDetect(req.headers['user-agent']);
        console.log(md.ua);
        console.log(md.ua.indexOf('iPhone'));

        if(md.ua.indexOf('iPhone') !== -1 || md.ua.indexOf('Android') !== -1 ){
            //if mobile 
            console.log('A PHONE HAS CONNECTED');
            // console.log(socket.id);
            device = 'm';
        }else {
            //if desktop
            console.log('A COMPUTER HAS CONNECTED');
            // console.log(socket.id);
            device = 'd'
        }

        next();

    });

app.use('/', express.static(__dirname + '/public'));

server.listen(port, function() {
    console.log('Server running at port:' + port);
});

/*
G L O B A L  V A R S  
*/
var device;
var connectionPwd = 'alexSmells';
var rooms = [];

/*
S O C K E T

- listening for connection
- always start w/ connection; everything happens within this scope

*/

io.on('connection', function(socket){ 
/*––––––––––– SOCKET.IO starts here –––––––––––––––*/

    /*
    .on
    .emit
    .broadcast
    */
    console.log('connected');
    //once connected find out what device it is

    // deviceType();

//send greeting message
    socket.emit('greet',{
        message: 'Hello from the server side!',
        id: socket.id, 
        d: device
    });

//recieve msg from buttonStartVideo
    socket.on('new video room', function(res){
        // console.log(res);
        console.log(res.msg);
        console.log('New room id is: %s, adding this desktop with the id of: %s', res.roomId, res.desktopId);
        //now we want to create a new room with this info
        var roomObj = {
            id: res.roomId,
            members: [],
            paired: false
        };
        
        //add it to rooms array
        rooms.unshift(roomObj);

        //create object for the dekstop comp
        var desktopObj = {
            id: res.desktopId,
            device: 'd',
            room: res.roomId
        };

        //FURTHERSTEPS: ADD IN SAFETY STUFF HERE
        //I.E is room empty? is there another desktop already in there?
        //Apon's code has exactly what we would need. 
        var match;
        //add our dekstop to the room
        for (var i = 0; i < rooms.length; i++){
            if(rooms[i].id == res.roomId){
                //add the socket.id of the desktop to the room object
                rooms[i].members.unshift(desktopObj);
                console.log(rooms);
                console.log('SAME');
                //join the sockets
                socket.join(res.roomId);
                //send confirmation back to client side
                //along with code for phone to input
                socket.emit('desktop connected', {
                    msg: 'successfully connected to room',
                    roomId: res.roomId
                });
                //so we know a match was found
                match = true;

                //lets check to see if we can emit to this room
                io.to(res.roomId).emit('to room test',{
                    msg: 'Hello new room',
                    id: res.roomId,
                    rooms: rooms
                });

            }else{
                match = false;
            }

            //if after the for loop is done and match still = false
            //send back that there was an error
            if(match != true && i == rooms.length) {
                console.log('ERROR');
                socket.emit('desktop connected', {
                        msg: 'failed to connect to room',
                        roomId: res.roomId
                });
            }
        }        
    });
    
    //recieves code input from phone
    socket.on('key', function(res){

        var keyExists;
        var currentRm;

        //if key matches a room key & pairing is false i.e. there isn't already a phone in there...
        for(var i = 0; i < rooms.length; i++){
            //find the room w the matching key
            if(rooms[i].id === res.key){
                console.log('THERE IS A ROOM WITH THIS KEY!');
                keyExists = true;
                currentRm = i;
                
                //if that room hasn't been paired with anything else
                if(rooms[i].paired != false) {
                    console.log('ERROR ROOM ALREADY PAIRED WITH A DEVICE');
                    socket.emit('phone access', {
                        msg: 'failed: unable to pair their is already a mobile device paired with this machine'
                    });
                    return;
                }else{
                    //create device obj to add to room
                    var phoneObj = {
                            id: socket.id,
                            device: 'm',
                            room: rooms[i].id
                    };
                    console.log('ABOUT TO ADD DEIVCE TO ROOM');
                    socket.join(rooms[i].id);
                    //add phonedevice to room
                    rooms[i].members.push(phoneObj);
                    console.log('ADDED PHONE TO ROOM');
                    
                        //send back to client it worked
                        socket.emit('phone access', {
                            msg: 'successfully added phone to room!',
                            id: rooms[i].id
                        });

                    //set paired to true
                    rooms[i].paired = true;
                    console.log(rooms);
                    return;
                }
            }else if(i === (rooms.length -1 ) && rooms[i].id != res.key ){
                console.log('NO MATCHING KEY');
                    socket.emit('phone access', {
                    msg: 'failed: wrong key input'
                });
                return;
            }
        }

    });


// THIS IS A TEST PIECE OF CODE
//recieves message from phone
//then emits the message to the whole room
    socket.on('phone input', function(result) {
        console.log(result);
        console.log(result.roomId);
        console.log(result.roomId2);

        io.to(result.roomId).emit('from phone', {
            msg: result.msg
        });

    });

//recieves scroll information from phone
    socket.on('phone scroll', function(res){
        // console.log(res.scroll);
        console.log(res.scroll);
        io.to(res.roomId).emit('scroll',{
            scroll: res.scroll,
            msg: 'scroll bitch'
        });
    });    


}); // E N D  O F  S O C K E T CONNECT

/*
F U N C T I O N S
*/




