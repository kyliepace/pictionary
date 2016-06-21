var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = require('socket.io').listen(server);


////////////// ON CONNECTION TO SERVER (?) //////////////////
io.on("connection", function(socket){
 
  socket.on("little_newbie", function(role){
    socket.role = role;
  });
  //getRole(socket); //assign role to user
  console.log("You are a "+socket.role);
  //socket.emit("assignRoles", socket.role); //assignRoles in the front-end
  
  socket.on("chooseWord", function(){
    //CHOOSE THE WORD
    var words = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
    ];
    var word = words[Math.floor(Math.random()* words.length)]; //choose random word from array
    socket.emit("secretWord", word);
  });
  
  socket.on("draw", function(position){
      socket.broadcast.emit("draw", position);
  });
  socket.on("guess", function(guess){
      socket.broadcast.emit("guess", guess);
  });
  socket.on("gameOver", function(){
    socket.emit("newGame");
  });
});



server.listen(8080);