var pictionary = function(serverSocket) {
    var socket = serverSocket;
    
    var role = "";
    
    var makeRole = function(existingArray){
        if(existingArray.indexOf("drawing")=== -1){ //if no one has chosen to be the drawer yet
            var answer = prompt('Are you drawing or guessing?').toString();
            if(answer.toLowerCase() === "drawing" || answer.toLowerCase() === "draw" || answer.toLowerCase() === "drawer"){
                role = "drawer";
                $("#guess").css("display", "hidden");
            }
            else{
                role = "guesser";
            }
        }
        else{
            role = "guesser";
            alert("You are a "+role);
        }
    console.log(role);
    socket.emit("little_newbie", role); //send selected role to the server and cause secretWord to be emitted
    };
    
    socket.on("makeRole", makeRole);

    /////GET SECRET WORD ////
    
    socket.emit("chooseWord"); //get the game started by choosing the secret word on the server
    var secretWord = ""; //create variable
    var showWord = function(word){
        secretWord = word; //save value to secretWord variable so we can check it against the guesses
        if(role === "drawer"){
            $("#secretWord").text(word);//show the secret word to the drawer
        }
    };
    socket.on("secretWord", showWord);
    
    
    /////// DRAWING ////////////////////
    var canvas, context;
    var drawing = false;
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    
    canvas.on("mousedown", function(){
        drawing = true;
    });
    canvas.on("mouseup", function(){
        drawing = false;
    });
    
    //only perform mousemove actions if drawing === true
    //does this create too many listeners for mouse events?
    canvas.on('mousemove', function(event) {
        if(drawing === true && role === "drawer"){
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                y: event.pageY - offset.top};
            draw(position);
            socket.emit("draw", position);
        }
    });
    
    socket.on("draw", draw);
    
    
    //////// GUESSES //////
    var guessBox = $('#guess>input');
    var madeGuess = $("#madeGuess");
    
    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        else if (role === "guesser"){
            var guess = guessBox.val();
            guessBox.val(''); //clear box
            madeGuess.text(guess); //change text shown in .html
            console.log(guess); //console log to be sure it worked
            socket.emit("guess", guess); //send event to server which then broadcasts to all other clients
            if(guess === secretWord){
                //role = "drawer"; //this guesser gets to be the drawer now
                context.clearRect(0, 0, canvas[0].offsetWidth, canvas[0].offsetHeight);
                madeGuess.text("You guessed correctly!");
            }
        }
    };
    
    guessBox.on("keydown", function(event) {  //call onKeyDown when the enter key is hit
        console.log("keydown");
        onKeyDown(event);
    });
    

   //when someone else makes a guess
    var makeGuess = function(serverGuess){
        console.log(serverGuess);
        $("#madeGuess").text(serverGuess);
        if (serverGuess === secretWord){
            $("#madeGuess").text("They guessed correctly!");
            context.clearRect(0, 0, canvas[0].offsetWidth, canvas[0].offsetHeight);
            //socket.emit("gameOver");
        }
    };
    
    //call makeGuess when other user emits guess event
    socket.on("guess", makeGuess);
    
    
    //////////// NEW GAME ///////////
    var newGame = function(role){
        if (role === "drawer"){
            role = "guesser";
            location.reload();
        }
        else {
            location.reload();
        }
    };
    
    socket.on("newGame", newGame);
    
};


$(document).ready(function() {
    var socket = io.connect();  
    pictionary(socket);
});