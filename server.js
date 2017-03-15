var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/public_html/index.html');
});

app.use('/public_html',express.static(__dirname + '/public_html'));

serv.listen(3000);
console.log("Server started.");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BarFight');

var Player = mongoose.model('Player', {
 name: {type:String, required:true},
 email: {type:String, required:true},
 password: {type:String, required:true}
});

function handleNicknameChoosing(socket){
 socket.on('username', function(nick, cb){
  Player.find({name:nick.username}, function(err, callback){
// Name already used
   if (callback.length > 0){
    cb({er:true, data:'That name is already chosen'});
    return;
   }
   var newPlayer  = new Player({
     name: nick.username,
     host: nick.host,
   });
   newPlayer.save(function (err) {
    if (err) {
     console.log(err);
    };
   });
   socket.id = newPlayer.id;
// New host player
   if(newPlayer.host === true){
    cb({er:null, data:null});
   } else {
// New player
    Player.find({host:true}, function(err, hostlist){
     cb({er:null, data:hostlist});
    });
   };
  });
 });
}

// Connet to host
function handleJoinGame(socket){
 socket.on('join-game', function(host, cb){
  Player.find({name:host.host, host:true}, function(err, opponent){
   Player.update({ id: opponent.id }, { host: false, opponent: socket.id }, function(err){});
   Player.update({ id: socket.id }, { host: false, opponent: opponent.id }, function(err){});
   
   cb(opponent);
  });
 });
};

var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket){

 handleNicknameChoosing(socket);
 handleJoinGame(socket);
 socket.on('disconnect',function(){
 });
});