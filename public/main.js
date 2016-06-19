var pictionary = function() {
    var canvas, context;

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
    
    var drawing = false;
    canvas.on("mousedown", function(){
        drawing = true;
    });
    canvas.on("mouseup", function(){
        drawing = false;
    });
    
    //only perform mousemove actions if drawing === true
    //does this create too many listeners for mouse events?
    canvas.on('mousemove', function(event) {
        if(drawing === true){
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                y: event.pageY - offset.top};
            draw(position);
            socket.emit("draw", position);
        }
    });
    
    socket.on("draw", draw(position));
    
    var guessBox;

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        var guess = guessBox.val();
        console.log(guess);
        socket.emit("guess", guess);
        guessBox.val('');
        //emit guess to server
        
    };

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    };

$(document).ready(function() {
    pictionary();
});