var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = require('socket.io').listen(server);

var roles = [];
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
var word= "";

////////////// EACH TIME A USER CONNECTS TO SERVER //////////////////
io.on("connection", function(socket){ 
  
  socket.emit("makeRole", roles); //1. emit "makeRole" event and pass the roles array
 
  socket.on("little_newbie", function(role){ //2. when user chooses role, pass that back to the server where it is pushed to the roles array
    roles.push(role);
    if (role === "drawer"){ //choose the secretWord if the user has chosen to be the drawer
      word = words[Math.floor(Math.random()* words.length)]; //choose random word from array
    }
    socket.emit("secretWord", word); //show this later so both clients are in agreement
  
    socket.broadcast.emit("secretWord", word);    
  }); 
  
  
  socket.on("draw", function(position){
      socket.broadcast.emit("draw", position);
  });
  socket.on("guess", function(guess){
      socket.broadcast.emit("guess", guess);
  });
  
  socket.on("newGame", function(){
    roles = [];
    socket.emit("newGame");
    socket.broadcast.emit("newGame");
  });
  
  socket.on("disconnect", function(){
    roles = [];
    socket.emit("newGame");
  });
  
});



server.listen(8080);