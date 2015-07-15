

var app = {};

app.init = function(){
	var socket;
	var roomID;
	var videoName;

	var start = function(){
		socket = io.connect();

		// location.hash = '#/home';
		console.log('mobile');
    	socket.emit('mobile');
		




	

	};//end of start
start();

}; //end of init

app.init();