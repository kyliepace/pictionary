var pictionary = function(serverSocket) {

    var socket = serverSocket;
    
    ///////  ASSIGN ROLES ///////////
    //limit what people can do based on roles
    var role;
    var assignRole = function(serverRole){
       role = serverRole;
       console.log(role);
    };
    socket.on("assignRoles", assignRole);
    
    /////GET SECRET WORD ////
    socket.emit("chooseWord"); //get the game started by choosing the secret word on the server
    var secretWord;//create variable
    var showWord = function(word){
        if(role === "drawer"){
            $("#word").text(word);//show the secret word to the drawer
        }
        secretWord = word; //save value to secretWord variable so we can check it against the guesses
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
    //when someone else makes a guess
    var makeGuess = function(guess){
        console.log(guess);
        $("#madeGuess").text(guess);
    };

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        else if (role === "guesser"){
            var guess = guessBox.val();
            makeGuess(guess); //if the enter key was pressed, call makeGuess
            console.log(guess);
            socket.emit("guess", guess); //send event to server
            guessBox.val(''); //clear box
            checkGuess(guess); //only check the guess made by the guesser
        }
    };
    
    //call onKeyDown when the enter key is hit
    guessBox.on("keydown", function(event) {
        console.log("keydown");
        onKeyDown(event);
    });
    //call makeGuess when other user emits guess event
    socket.on("guess", makeGuess);
    
    //check the guess
    var checkGuess = function(guess){
        if(guess === secretWord){
            $("#madeGuess").text("You guessed correctly!");
            socket.emit("switchRoles");
            role = "drawer";
        }
    };
};


$(document).ready(function() {
    var socket = io.connect();  
    pictionary(socket);
});