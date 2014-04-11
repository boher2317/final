function submitEasy()
{
    if (operator == 1)
    {
        if (answer == x + y)
        correct = 1;
        else
        correct = 0;
    }    
    else if (operator == 2)
    {
        if (x > y)
        {
            if (answer == x - y)
            correct = 1;
            else
            correct = 0;
        }
        else
        {
            if (answer == y - x)
            correct = 1;
            else
            correct = 0;
        }     
    }
    endSubmit();
}

function submitNormal()
{
    if (operator == 1)
    {
        if (answer == z + a)
        correct = 1;
        else
        correct = 0;
    }
    else if (operator == 2)
    {
        if (z > a)
        {
            if (answer == z - a)
            correct = 1;
            else
            correct = 0;
        }
        else
        {
            if (answer == a - z)
            correct = 1;
            else
            correct = 0;
        }
    }
    else if (operator == 3)
    {
        if (answer == x * y)
        correct = 1;
        else
        correct = 0;
    }
    else
    {
        if (answer == (x * y) / x)
        correct = 1;
        else
        correct = 0;
    }   
    endSubmit(); 
}

function submitHard()
{
    if (operator == 1)
    {
        if (answer == c + b)
        correct = 1;
        else
        correct = 0;
    }
    else if (operator == 2)
    {
        if (answer == b - c)
        correct = 1;
        else
        correct = 0;
        
    }
    else if (operator == 3)
    {
        if (answer == x * z)
        correct = 1;
        else
        correct = 0;
    }
    else
    {
        if (answer == (x * z) / x)
        correct = 1;
        else
        correct = 0;
    }
    endSubmit();
}

function submitGenius()
{
    if (operator == 1)
    {
        if (answer == c + b + z)
        correct = 1;
        else
        correct = 0;
    }
    else if (operator == 2)
    {
        if (answer == c - b)
        correct = 1;
        else 
        correct = 0;
    }
    else if (operator == 3)
    {
        if (answer == a * z)
        correct = 1;
        else
        correct = 0;
    }
    else
    {
        if (answer == (a * z) / a)
        correct = 1;
        else
        correct = 0;
    }
    endSubmit();
}

function endSubmit()
{
    if (correct == 1)
    {
        score += 1;
        $("#result").html("Correct!");
    }
    else
    $("#result").html("Incorrect!"); 
    // reset answer field to blank    
    document.getElementById("answer").value = '';
    play();
}
