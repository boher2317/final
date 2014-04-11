/* 
* Javascript for final project
*/

// variable to track difficulty. defaults to easy.
var difficulty = 1;

// starting time, in seconds
var time = 180;

// varibles which will be randomly determined and used in the questions
var x, y, z, a, b, c;

// variable to determine what operation the next question will be.
// 1 is add, 2 is subtract, 3 is multiply, 4 is divide.
var operator;

// store user's answer
var answer;

// determine if user's answer is right or wrong. 1 = right 0 = wrong.
var correct;

// keep track of how many correct answers were given
var score = 0;

$(window).load(function() {

    // listen for keydown anywhere in body.  this code taken from CS50 pset8.
    $(document.body).keydown(function(event) {
        return keystroke(event, true);
    });

    // listen for click on any of the difficulty buttons, and set
    // difficulty accordingly
    $("#easy").click(function(event) {
        difficulty = '1';
    });
    
    $("#normal").click(function(event) {
        difficulty = 2;
    });
    
    $("#hard").click(function(event) {
        difficulty = 3;
    });
    
    $("#genius").click(function(event) {
        difficulty = 4;
});

    // listen for click on start and back buttons
    $("#start").click(function(event) {
        // run countdown function every second
        timer = setInterval(countdown, 1000);
        // stop countdown and display end form after 3 mins (and 1 second)
        setTimeout(end, 181000);
        // automatically set focus on answer input text box
        $("#answer").focus();
        // stop user from clicking start again, which would mess up the timer.
        // also stop further clicks on difficulty buttons
        this.disabled = true;
        document.getElementById("easy").disabled = true;
        document.getElementById("normal").disabled = true;
        document.getElementById("hard").disabled = true;
        document.getElementById("genius").disabled = true;
        play();
    });
    
    $("#back").click(function(event) {
        back();
    });

});

function end()
{   
    clearInterval(timer);
    $("#answer_form").html("Game over! You answered " + score + " question(s) correctly.  Click below to submit your score (if logged in) and go back to the main page.");
}

function back()
{
    // did not know how to send a js variable to php for use in the database.
    // found this method of doing so via google search and stackoverflow.com.
    // main.php declares variables $score and $difficulty that take these parameters
    // as their values, then redirects back to the main page after it receives them.
    window.location.href = "main.php?score=" + score + "&difficulty=" + difficulty; 
}

function countdown()
{
    time -= 1;
    $("#timer").html(time);
}

function play()
{   
    x = Math.floor((Math.random() * 10) + 1); // between 1 and 10
    y = Math.floor((Math.random() * 10) + 1); 
    z = Math.floor((Math.random() * 40) + 10); // between 10 and 40
    a = Math.floor((Math.random() * 40) + 10);
    b = Math.floor((Math.random() * 80) + 20); // between 20 and 80
    c = Math.floor((Math.random() * 80) + 20);
        
    if (difficulty == 1)
    easy();  
    
    if (difficulty == 2)
    normal();
    
    if (difficulty == 3)
    hard();
    
    if (difficulty == 4)
    genius();
}

function easy()
{
    // randomly selects a 1 or 2 to determine operator of next question.
    // only addition and subtraction available in easy mode.
    operator = (Math.floor(Math.random() * 2) + 1)  
        
    if (operator == 1)
    {
        $("#game_area").html(x + " + " + y);
    }
    else
    {
        // ensure there are no negative answers in easy mode
        if (x > y)
        $("#game_area").html(x + " - " + y);
        else 
        $("#game_area").html(y + " - " + x);
    }
}

function normal()
{
    // randomly selects 1, 2, 3, or 4 to determine operator of next question.
    operator = (Math.floor(Math.random() * 4) + 1);
    
    if (operator == 1)
    {
        $("#game_area").html(z + " + " + a);
    }
    else if (operator == 2)
    {
        if (z > a)
        {
            $("#game_area").html(z + " - " + a);
        }
        else
        {
            $("#game_area").html(a + " - " + z);
        }   
    }
    else if (operator == 3)
    {
        $("#game_area").html(x + " X " + y);
    }
    else
    {
        // ensures one number is divisible by the other
        $("#game_area").html((x * y) + " / " + x);
    }
}

function hard()
{
    operator = (Math.floor(Math.random() * 4) + 1);
    
    if (operator == 1)
    {
        $("#game_area").html(c + " + " + b);
    }
    else if (operator == 2)
    {
        $("#game_area").html(b + " - " + c);
    }
    else if (operator == 3)
    {
        $("#game_area").html(x + " X " + z);
    }
    else
    {
        $("#game_area").html((x * z) + " / " + x);
    }
}

function genius()
{
    operator = (Math.floor(Math.random() * 4) + 1);
    
    if (operator == 1)
    {
        $("#game_area").html(c + " + " + b + " + " + z);
    }
    else if (operator == 2)
    {
        $("#game_area").html(c + " - " + b);   
    }
    else if (operator == 3)
    {
        $("#game_area").html(a + " X " + z);
    }
    else
    {
        $("#game_area").html((a * z) + " / " + a);
    }
}

function submitAnswer()
{
    // jquery syntax won't work while trying to assign a variable 
    answer = document.getElementById("answer").value;
    
    if (difficulty == 1)
    submitEasy();       
    
    else if (difficulty == 2)
    submitNormal();
    
    else if (difficulty == 3)
    submitHard();
    
    else
    submitGenius();
}

// keystroke function from cs50 pset8
function keystroke(event, state)
{
    // ensure we have event
    if (!event)
    {
        event = window.event;
    }
    
    // "enter" key
    if (event.keyCode == 13)
    {
        submitAnswer();
    }
}


