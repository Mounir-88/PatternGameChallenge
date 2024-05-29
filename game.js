var buttonColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'brown', 'gray'];
const excludedKeys = [9, 18, 27];
var gamePattern = [];
var userClickedPattern = [];
var count = 1;
var speed = 1000;
var pressedSpeed = 700;

// Function to generate a random number between 0 and 3
function nextSequence() {
    var randomNumber = Math.floor(Math.random() * 8);
    return randomNumber;
}

// Pushing a new set of chosen colors to the gamePattern array
function fill() {
    gamePattern = []; 
    for (var i = 0; i < count; i++) {
        var randomChosenColor = buttonColors[nextSequence()];
        gamePattern.push(randomChosenColor);
    }
}

function next(i) {
    if (i < gamePattern.length) {
        togglePressed(gamePattern[i]);
        setTimeout(function() {
            next(i + 1);
        }, speed);
    }
}

// Toggle the pressed class when the button is clicked
$(document).ready(function() {
    pressingKey();
});

function pressingKey() {
    $(document).on('keydown', function(event) {
        if (!excludedKeys.includes(event.keyCode)) {
            start();
        }
    });
}

function start() {
    
    $('h1').text("LEVEL " + count).show();
    userClickedPattern = [];
    fill();
    setTimeout(function(){
        next(0);    
    }, 1000);
    
    usersTurn();
}

function usersTurn() {
    // Click event handler for buttons
    $(".btn").off("click").on("click", function() {
        var userChosenColor = $(this).attr("id");
        userClickedPattern.push(userChosenColor);
        playAudioColor(userChosenColor);
        togglePressed(userChosenColor);
        checkUserInput();
    });

    // Keydown event handler for specific keys
    $(document).off('keydown').on('keydown', function(event) {
        if (!excludedKeys.includes(event.keyCode)) {
            handleKeyDown(event.key.toLowerCase());
        }
    });
}

// Handle keydown event based on the pressed key
function handleKeyDown(key) {
    switch (key) {
        case 'a':
            handleButtonPress('green');
            break;
        case 's':
            handleButtonPress('red');
            break;
        case 'd':
            handleButtonPress('yellow');
            break;
        case 'f':
            handleButtonPress('blue');
            break;
        case 'h':
            handleButtonPress('purple');
            break;
        case 'j':
            handleButtonPress('orange');
            break;
        case 'k':
            handleButtonPress('brown');
            break;
        case 'l':
            handleButtonPress('gray');
            break;
        default:
            break;
    }
}

// Handle button press
function handleButtonPress(color) {
    $('#' + color).click(); // Simulate click event
}

function checkUserInput() {
    var currentIndex = userClickedPattern.length - 1;

    if (userClickedPattern[currentIndex] === gamePattern[currentIndex]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                currentAudioTime = 0;
                $('h1').text("NEXT LEVEL!");
                count++;
                speed *= 0.9;
                pressedSpeed *= 0.9;
                startNextLevelCountdown(); // Start countdown for next level
            }, 1000);
        }
    } else {
        playAudioColor('wrong');
        togglePressed(userClickedPattern[currentIndex]);
        setTimeout(function() {
            currentAudioTime = 0;
            $('h1').text("GAME OVER");
            losingAudio();
            count = 1;
            speed = 1000;
            pressedSpeed = 700;
            setTimeout(start, 1000); // Restart the game after 1 second
        }, 1000);
    }
}

// Function to start countdown for the next level
function startNextLevelCountdown() {
    var countdown = 3;
    var countdownInterval = setInterval(function() {
        if (countdown === 0) {
            clearInterval(countdownInterval);
            start(); // Start the next level
        } else {
            $('h1').text(countdown);
            countdown--;
        }
    }, 1000);
}

// Add the .pressed class css to the chosen button
function togglePressed(color) {
    var button = $("#" + color);
    button.addClass("pressed");
    setTimeout(function() {
        button.removeClass("pressed");
    }, pressedSpeed);
}

// Global variable to store the current position of the audio


function playAudioColor(key) {
    var audio;
    if (key !== 'wrong') {
        audio = new Audio('sounds/'+key+'.mp3');
    } else {
        audio = new Audio('sounds/wrong.mp3');
    }
    audio.play();
}



function losingAudio() {
    var audio = new Audio('sounds/8-bit-video-game-fail-version-2-145478.mp3');
    audio.play();
}
