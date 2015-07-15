

var app = {};

app.init = function(){
var socket;
var roomID;
var shortID;
var videoName;



var step = 1; // visible frame
var targetStep = 1; // frame to animate to
var images = new Array; // stores all of the frames for quick access
var scrollPos; // scroll position of the window
var totalFrames = 41; // the number of images in the sequence of JPEG files (this could be calculated server-side by scanning the frames folder)


var form = $('form.login');
var secretText = form.find('input[type=text]');
var key = " ", animationTimeout;
    



var start = function(){

window.requestAnimFrame = (function(){ // reduce CPU consumption, improve performance and make this possible
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

for(i = 0; i < totalFrames; i++) { // loop for each image in sequence
    images[i] =  new Image(); // add image object to array
    images[i].src = "./frames/frame_"+pad(i, 3)+".jpg"; // set the source of the image object
}




socket = io.connect();////////////////////////////////////////////////


        console.log('socket is ocnnect from client');

        socket.on('device', function(data){
        if(data.device == 'm'){
            location.hash = '#/mobilehome'
        }else{
            location.hash = '#/home'
            render.home();
            console.log('we know its a d so go to home hash');
            console.log('current lochash is:    ' + location.hash);
        }
        });
       

        socket.on('access', function(data){//CLIENT GRANTED ACCESS
			if(data.access === 'granted'){//IF HAVE ACCESS LET THEM DO SOMETHING HERE
                form.hide();
                // $('body').css('background-color:green');
                console.log('access granted');
                
///////////////
                attachEvents();
                scrollThru();

//////////////

                // $(window).on('hashchange', function() {
                //     if(ignore){
                //         return;
                //     }
                //     console.log('hashChange here');
                //     // var hash = window.location.hash;
                //     console.log('currently hash is:   ' + hash);

                //     socket.emit('frameChange', {
                //         hash: hash,
                //         key: key
                //     });

                // });
                // $('#btn-red').off('click').on('click', function() {
                // console.log('button pressed');
                // hash = hash + 1;
                // console.log('the hash is now   ' + hash);

                // });
               

                // socket.on('navigate', function(data){
                //     //other device did seomthing now do it here too
                //     console.log('got the go ahead to navigate');
                //     window.location.hash = data.hash;

                //     ignore = true;

                //     setInterval(function(){
                //         ignore = false;
                //     }, 100);
                // });

            
               

            }
            else{
                console.log('access wasnt granted try again');
                clearTimeout(animationTimeout);

                secretText.addClass('denied animation');

                animationTimeout = setTimeout(function(){
                    secretText.removeClass('animation');
                },1000);

                form.show();

            }

		});

		
	
    attachEvents();
   
    };//end of start////////////////////////////////////
    /////////////////////////////////////////////////

    /////RENDER ROOMS////////////////////////////////
	var render = {};
    render.home = function() {
        console.log('desktop home');
       
        var tplToCompile = $('#tpl-home').html();
        var compiled = _.template(tplToCompile);
        $('#app').html(compiled);
       
       
        attachEvents();

    };

    render.mobilehome = function() {
        console.log('mobile home');
        var tplToCompile = $('#tpl-mobilehome').html();
        var compiled = _.template(tplToCompile);
        $('#app').html(compiled);
        attachEvents();

	};

    render.videoPage = function() {
    console.log('you are on video page');
	};
    render.mobileVideoPage = function() {
    console.log('you are on mobile video page');
	};
	



	//////DESKTOP EVENTS/////////////////////////////////////////////////
	var attachEvents = function(){
        ///////////---------HASHCHANGE------------/////////
        $(window).off('hashchange').on('hashchange', function() {
            var hash = location.hash;
            console.log(hash);
            if (hash === '#/home') {
                render.home();
            } else if (hash === '#/mobilehome') {
                render.mobilehome();
            }
            attachEvents();
        });

    
	

        ///////////--------BUTTONS------////////////////////
     $('#sub').off('click').on('click', function() {
        console.log('submit pressed');
            key = $('#key').val();
            if(key.length){
                socket.emit('load', {
                    key: key
                });
                console.log('secrete entered');
                console.log('user thinks the key is:   ' + key);
            }
        });
    };//end of desktop events/////////

    var scrollThru = function(){
            console.log('we made it to scroll through');
                (function animloop(){ // the smoothest animation loop possible
                requestAnimFrame(animloop);
                targetStep = Math.max( Math.round( getYOffset() / 30 ) , 1 ); // what frame to animate to
                if(targetStep != step ) { step += (targetStep - step) / 5; } // increment the step until we arrive at the target step
                changeFrame();
                })();

            function changeFrame() {
                var thisStep = Math.round(step); // calculate the frame number
                if(images.length > 0 && images[thisStep]) { // if the image exists in the array
                    if(images[thisStep].complete) { // if the image is downloaded and ready
                    
                        var ignore = false;

                        socket.emit('frameChange', {
                            key: key,
                            thisStep: thisStep,
                            step: step
                        });

                        socket.on('navigate', function(data){
                            //other device did seomthing now do it here too
                            console.log('got the go ahead to navigate');
                            // window.location.hash = data.hash;
                            // var tplToCompile = $('#video').html();
                            // var compiled = _.template(tplToCompile)({

                            // });

                           
                            // $('#video').attr('src',images[data.newStep].src);
                            console.log(data['newStep']);
                            // console.log(images[data.newStep].src);
                            // var tplToCompile = $('#tpl-home').html();
                            // var compiled = _.template(tplToCompile, {
                            //     img: images[data.newStep].src
                            // });
                            
                            // $('#app').html(compiled);

                            renderHome2(data['newStep']);
f
                            ignore = true;

                            setInterval(function(){
                                ignore = false;
                            }, 100);


                        });
             // change the source of our placeholder image
                    }
                }
            }

    };    



var renderHome2 = function(step) {
            console.log(images[step].src);
            var tplToCompile = $('#tpl-home2').html();
            var compiled = _.template(tplToCompile, {
               img : images[step].src
            });
                            
            $('#app').html(compiled);
};







start();

}; //end of init

app.init();



function resizeAdjustments() { // fit everything to the screen

    $('html, body').css('height',(totalFrames*30)+'px'); // increase the height of the document 30 pixels for every frame in the JPEG sequence
    var image_width   = $('#video').css('width').replace('px','');
    var image_height  = $('#video').css('height').replace('px','');
    var height_ratio  = image_height / document.body.clientHeight;
    var width_ratio   = image_width / document.body.clientWidth;
    if (height_ratio < width_ratio) {
        $('#video').css('top',0); // reposition the video image
        var difference = parseInt(image_width-document.body.clientWidth); // calculate the difference we need to accomodate for
        $('#video').css('width','auto');
        $('#video').css('height','100%'); // resize image to fill the height of the viewport
        if(document.body.clientWidth<image_width) {
            $('#video').css('left',(difference/2)*-1); // reposition the video image from the left
        }else{
            $('#video').css('left',0);
        }
    }else{
        $('#video').css('left',0);
        var difference = parseInt(image_height-document.body.clientHeight); // calculate the difference we need to accomodate for
        if(document.body.clientHeight<image_height) {
            $('#video').css('top',(difference/2)*-1); // reposition the video image from the top
        }else{
            $('#video').css('top',0);
        }
        $('#video').css('width','100%'); // resize image to fill the width of the viewport
        $('#video').css('height','auto');
    }
}

function getYOffset() { // get distance scrolled from the top
    var pageY;
    if(typeof(window.pageYOffset)=='number') {
        pageY=window.pageYOffset;
    }else{
        pageY=document.documentElement.scrollTop; // IE
    }
        return pageY;
    }

    function pad(number, length) { // pad numbers with leading zeros for JPEG sequence file names
        var str = '' + number; while (str.length < length) { str = '0' + str; } return str;
    }