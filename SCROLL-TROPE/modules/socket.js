// export function for listening to the socket
// var export = module.exports = {};

module.exports = function (socket) {

  var rooms =[];

  console.log('can I get io here?');
  console.log(socket);

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
    console.log(data.id);
    console.log(data.rmKey);
      // socket.emit('recieve:scroll', {
      //   type: data.type,
      //   id: socket.id,
      //   step: data.step
      // });
      socket.to(data.rmKey).emit('send:scrolltorm', {
        msg: 'SUCCESSFULLY CREATED AND JOINED ROOM'
      });
    callback('error',socket.id);
  });

  //RECIEVE MESSAGE FROM DESKTOP TO CREATE ROOM
  socket.on('send:rmcreate', function(data,callback){
    console.log(data);
    //first lets see if this client is already in a room
    if(findInRm(socket.id)!= null){
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



  // FUNCTIONS
  // //////////////////////////////////////
  var findInRm = function(id){
    for(var i =0; i < rooms.length; i++){
      if(rooms[i].desktop.id == id){
        return rooms[i];
      }
      return null;
    }
  };

  var createKey = function(n){
    return Math.random().toString(36).substr(2,n);
  };

};
