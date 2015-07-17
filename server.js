/*
TROPE
This version of trope is it's base interaction, no remote, just scrolling to video scrub
*/

//create express server
var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);

//currently the amazon web server that we are going to use re-routes port 3000 to port 80 / http
var port = 3000;

//to check server is running
server.listen(port, function() {
    console.log('Server running at port:' + port);
});



//Point server to our static site
//as well as putting libs under just /lib for ease

app.use('/', express.static(__dirname + '/public'));
app.use('/lib', express.static(__dirname + '/public/lib'));
app.use('/js', express.static(__dirname + '/public/js'));


//UNUSED RIGHT NOW BUT MAY BE HELPFUL IN NEAR NEAR FUTURE
////////////////////////////////////////////////////////////

//USE THIS FOR RESTUFUL & CORS STUFF
//NOT DELETING FOR NOW AS THIS MAY BE A MORE SECURE WAY TO PULL OUR IMAGES OFF THE SERVER

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
