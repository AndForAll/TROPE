
/*
G L O B A L  V A R S  
*/

var app = {};

var socket;
var deviceType;

var images = [];
var totalFrames = 426;

var instructions = [
    {
        msg: 'Helpful Hints: LED Circuit',
        frames: [1,130]

    },
    {
        msg: 'Aligator Clips',
        frames: [140,147]
    },
    {
        msg: 'Aligator Clips, Coin Cell Battery & Holder',
        frames: [149,151]
    },
    {
        msg: 'Aligator Clips, Coin Cell Battery & Holder, LED',
        frames: [152,179]
    },
    {
        msg: 'Attach black clip to the short leg of the LED (The Negative Side!)',
        frames: [180,204]
    },
    {
        msg: 'Attach Other end of black clip to the Negative side of Battery',
        frames: [205,229]
    },
    {
        msg: 'Attach red clip to the longer LED leg (The Positive side!)',
        frames: [230,269]
    },
    {
        msg: 'Connect the other end of the red Aligator clip to the positive side of the battery',
        frames: [272,286]
    },
    {
        msg: 'BLINK BLINK! YAY YOU DID IT!',
        frames: [288,289]
    }
];

console.log(instructions);

// video.init = function() {
    //put all paths to images in array
    for(var i = 1; i <= totalFrames; i++){
        images[i] = new Image();
        images[i].src = "./frames/frame_"+pad(i, 3)+".jpg";
    }
// }; // end of video.init

var targetStep = 1;
var step = 1;

//phone
var currentRm;


app.init = function() {

    location.hash = '';
    location.hash = '#home';

    //starts connection w/ socket
    var start = function() {

        //init socket w/ server.. i.e. connect to server
        socket = io.connect();

        console.log('in socket connect');

        //greeting message to check
        socket.on('greet', function(res){
            console.log(res);
            deviceType = res['d'];
            renderHome();
        });

    };

    start();
    attachEvents();
    hashRouter();
    // video.init();

}; // E N D  O F  A P P . I N I T

/*
H A S H  R O U T E R
*/

// HASH hashRouter
var hashRouter = function(){
    $(window).off('hashchange').on('hashchange', function() {
        console.log('hash is currently: ' + location.hash);
        if(location.hash == '#home'){
            renderHome();
        }else if(location.hash == '#play'){
            renderPlay();
        }else if(location.hash == '#mobileControl'){
            renderPhone();
        }

        attachEvents();
    });
};

/*
E V E N T S
*/

var attachEvents = function() {

        /*
    FOOTER
    */
    $('#btnHome').off('click').on('click',function(){
        location.hash='';
        location.hash = '#home';
    });

    //eventually this will hook up wot create a new room and give the key to the user
    $('#btnConnect').off('click').on('click',function(){
        location.hash = '#home';
    });

    /*
    DESKTOP
    */
    $('.btnStartVideo').off('click').on('click',function(){
        
        console.log('PLAY PLAY');

        //create a random ID w/ 4 chars for the room we are about to create
        var id = createID(5);
        //send to serevr
        socket.emit('new video room', {
            msg: 'create new video viewing room',
            desktopId: socket.id,
            roomId : id
        });

        //listen to hear back from server if connection failed
        //render the error page with the message
        //if not render the video page with the code for the phone
        socket.on('desktop connected', function(result) {
            console.log(result);
            //if failed render error page
            if(result.msg.indexOf('failed') !== -1){
                console.log('failure to create and join new video room');
                // location.hash='#error';
                renderError(result.msg);
            }else {
                console.log(result.msg);
                //if successful render video page with pop up to link phone
                renderPlay(result.roomId);
            }

        });

    });

    //button to close desktop display of code for phone
    $('.btnClosePhoneCode').off('click').on('click', function() {
        var modal= document.getElementById('modal');
        var shade= document.getElementById('shade');
        modal.style.display=shade.style.display= 'none';
    });


     //recieve controls from phone
    socket.on('from phone', function(result) {
        console.log(result.msg);
        var modal= document.getElementById('modal');
        var shade= document.getElementById('shade');
        modal.style.display=shade.style.display= 'none';
    });

        /*
    MOBILE
    */
    //when key is input on phone check if correct and add to room
    $('#btnKeySub').off('click').on('click', function() {
        console.log('submitting key');
        var key = $('#key').val();
        // var form = $('form.login');
        //if the input for the key isnt empty send to server
        //along with socket.id and device type
        if(key.length){
            socket.emit('key', {
                key: key,
                phoneId: socket.id,
                d: deviceType
            });
        }   
            //listen for permission from server
            socket.on('phone access', function(res){
                //check if an error occured
                //and if so render error page withe message
                if(res.msg.indexOf('failed') !== -1){
                    renderError(res.msg);
                }else {
                //else render the mobilecontrol page to the phone
                    currentRm = res.id;
                    console.log(res.msg);
                    location.hash = '#mobileControl';
                }
                
            });
    });

    //test button to see if sends to room
    $('#test').off('click').on('click', function() {
        var rmId = $('#roomId').val();

        socket.emit('phone input',{
            msg: 'im sending stuff',
            roomId: currentRm,
            roomid2: rmId
        });


    });

    //listen for scroll directions from phone
    socket.on('scroll', function(res){
        // console.log(res.msg);
        console.log(res.scroll);
        console.log(images);
        // console.log(video['images']);
        // console.log(video.images[res.scroll]);
        //if the image exsists in the array
        if(images.length > 0 && images[res.scroll]) {

            if(images[res.scroll].complete) {
                if($('#video').attr('src') != images[res.scroll].src){
                    $('#video').attr('src', images[res.scroll].src);
                }
            }
        }

    });

}; //END OF ATTACH EVENTS

var vidEvents = function() {

//trying it directly in this func
//if doesn't work.. call this function in a function that is specifically for sending
    function getScroll() {
        var pageY;
        var pageYround;
    if(typeof(window.pageYOffset)=='number') {
        pageY = window.pageYOffset;
        pageYround = Math.max( Math.round(pageY / 30), 1);
    }else{
        pageY=document.documentElement.scrollTop; // IE
        pageYround = Math.max( Math.round(pageY / 30), 1);
    }   

    return pageY;

    };

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

    (function animloop(){ // the smoothest animation loop possible
    requestAnimFrame(animloop);
    targetStep = Math.max( Math.round( getScroll() / 30 ) , 1 ); // what frame to animate to
    

    //maybe add a debouncer!!!
        if(targetStep != step ) { 
            step += (targetStep - step) ; 
            console.log(step);
            socket.emit('phone scroll', {
                scroll: targetStep,
                roomId: currentRm
            });
            //change the text on the phone
            for(var i = 0; i < instructions.length; i++) {
                if(targetStep >= instructions[i].frames[0] && targetStep <= instructions[i].frames[1] ){
                    $('#phone_display').text(instructions[i].msg);
                }
            }
            // $('#phone_display').text(targetStep);
        }

    })();

};

/*
P A G E  R E N D E R S
*/
//DESKTOP & PHONE
var renderHome = function() {

    //get which device you are on
    console.log(deviceType);
    if(deviceType == 'm'){
        // assign the html you want to compile to a var
        var tplToCompile = $('#tpl_mobilehome').html();

        //using underscore's syntax to say you want to compile the html with underscore
        var compiled = _.template(tplToCompile);

        // where you want to compile the html
        $('#app').html(compiled);
        attachEvents();
    }else{
        // assign the html you want to compile to a var
        var tplToCompile = $('#tpl_home').html();

        //using underscore's syntax to say you want to compile the html with underscore
        var compiled = _.template(tplToCompile);

        // where you want to compile the html
        $('#app').html(compiled);
        attachEvents();
    }

};
//DESKTOP
var renderPlay = function(code) {

    //TO TEST IF ROOM WORKED
    socket.off('to room test').on('to room test', function(res){
        console.log('recieved room message');
        console.log(res);
    });

    // assign the html you want to compile to a var
    var tplToCompile = $('#tpl_play').html();

    //using underscore's syntax to say you want to compile the html with underscore
    var compiled = _.template(tplToCompile, {
        //WHAT YOU WANT TO SEND TO PAGE HERE
        code: code
    });

    // where you want to compile the html
    $('#app').html(compiled);
     attachEvents();
};


//PHONE AFTER SUCCESSFUL KEY INPUT
var renderPhone = function() {
    console.log('we in render home bitches');
    //this is what is rendered after the key has been put into the phone
    var tplToCompile = $('#tpl_mobileControl').html();
    var compiled = _.template(tplToCompile, {
        message: 'YOU FUCKING DID IT',
        id: currentRm
    });
    $('#app').html(compiled);

        vidEvents();
     attachEvents();
};

//DESKTOP & PHONE
var renderError = function(error) {
    location.hash='#error';
    var tplToCompile = $('#tpl_error').html();
    var compiled = _.template(tplToCompile, {
        message: error
    });
    $('#app').html(compiled);
     attachEvents();
};

/*
O T H E R  F U N C T I O N S
*/

//n is the number of characters we grab after the decimal...
var createID = function(n) {
    return Math.random().toString(36).substr(2,n);
};

/*
V I D E O   S T U F F
*/

function pad(number, length) { // pad numbers with leading zeros for JPEG sequence file names
    var str = '' + number; while (str.length < length) { str = '0' + str; } return str;
}

app.init();