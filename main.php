<?php 
    
    require("./includes/config.php");
    
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {   
        if (isset($_POST['play']))
        render("game_form.php");
        
        if (isset($_POST['scores']))
        {
            // show users their personal high scores, if logged in
            if (!empty($_SESSION["id"]))
            {
                $rows = query("SELECT escore, nscore, hscore, gscore FROM users WHERE id = ?", $_SESSION["id"]);
       
                $positions = [];
                foreach ($rows as $row)
                {
                    $positions[] = [
                    "escore" => $row["escore"],
                    "nscore" => $row["nscore"],
                    "hscore" => $row["hscore"],
                    "gscore" => $row["gscore"]
                    ];
                }
                
                render("scores_form.php", ["positions" => $positions]);
            }
            
            else
            apologize("You must be logged in to view your high scores.");
        }
        
        if (isset($_POST['highscores']))
        {
            // show users the public high scores
            $users = query("SELECT username FROM highscores");
            $hescore = query("SELECT hescore FROM highscores WHERE id = 0");
            $hnscore = query("SELECT hnscore FROM highscores WHERE id = 1");
            $hhscore = query("SELECT hhscore FROM highscores WHERE id = 2");
            $hgscore = query("SELECT hgscore FROM highscores WHERE id = 3");
            
            $positions[] = [
            "euser" => $users[0]["username"],
            "nuser" => $users[1]["username"],
            "huser" => $users[2]["username"],
            "guser" => $users[3]["username"],
            "hescore" => $hescore[0]["hescore"],
            "hnscore" => $hnscore[0]["hnscore"],
            "hhscore" => $hhscore[0]["hhscore"],
            "hgscore" => $hgscore[0]["hgscore"]
            ];
            
            render("highscores_form.php", ["positions" => $positions]);
        }
        
        if (isset($_POST['login']))
        render("login_form.php");
        
        if (isset($_POST['register']))
        render("register_form.php");  
    }   
    
    if ($_SERVER["REQUEST_METHOD"] == "GET")
    {
        // if a user is logged in, check to see if they beat their personal high score.
        // if so, update the database. also checks if user beat the public high score.
        if (!empty($_SESSION["id"]))
        {
            // see notes in math.js, line 84
            $difficulty = $_GET['difficulty'];
            $newScore = $_GET['score'];
        
            if ($difficulty == 1)
            {
                $oldScore = query("SELECT escore FROM users WHERE id = ?", $_SESSION["id"]); 
                $highScore = query("SELECT hescore FROM highscores WHERE id = 0");   
                if ($newScore > $oldScore[0]['escore'])
                {
                    query("UPDATE users SET escore = ? WHERE id = ?", $newScore, $_SESSION["id"]);
                }
                
                if ($newScore > $highScore[0]['hescore'])
                {
                    $username = query("SELECT username FROM users WHERE id = ?", $_SESSION["id"]);
                    query("UPDATE highscores SET hescore = ?, username = ? WHERE id = 0", $newScore, $username[0]["username"]);
                }
            }
        
            if ($difficulty == 2)
            {
                $oldScore = query("SELECT nscore FROM users WHERE id = ?", $_SESSION["id"]); 
                $highScore = query("SELECT hnscore FROM highscores WHERE id = 1");   
                if ($newScore > $oldScore[0]['nscore'])
                {
                    query("UPDATE users SET nscore = ? WHERE id = ?", $newScore, $_SESSION["id"]);
                }
                
                if ($newScore > $highScore[0]['hnscore'])
                {
                    $username = query("SELECT username FROM users WHERE id = ?", $_SESSION["id"]);
                    query("UPDATE highscores SET hnscore = ?, username = ? WHERE id = 1", $newScore, $username[0]["username"]);
                }
            }
        
            if ($difficulty == 3)
            {
                $oldScore = query("SELECT hscore FROM users WHERE id = ?", $_SESSION["id"]); 
                $highScore = query("SELECT hhscore FROM highscores WHERE id = 2");   
                if ($newScore > $oldScore[0]['hscore'])
                {
                    query("UPDATE users SET hscore = ? WHERE id = ?", $newScore, $_SESSION["id"]);
                }
                
                if ($newScore > $highScore[0]['hhscore'])
                {
                    $username = query("SELECT username FROM users WHERE id = ?", $_SESSION["id"]);
                    query("UPDATE highscores SET hhscore = ?, username = ? WHERE id = 2", $newScore, $username[0]["username"]);
                }
            }
        
            if ($difficulty == 4)
            {
                $oldScore = query("SELECT gscore FROM users WHERE id = ?", $_SESSION["id"]); 
                $highScore = query("SELECT hgscore FROM highscores WHERE id = 3");   
                if ($newScore > $oldScore[0]['gscore'])
                {
                    query("UPDATE users SET gscore = ? WHERE id = ?", $newScore, $_SESSION["id"]);
                }
                
                if ($newScore > $highScore[0]['hgscore'])
                {
                    $username = query("SELECT username FROM users WHERE id = ?", $_SESSION["id"]);
                    query("UPDATE highscores SET hgscore = ?, username = ? WHERE id = 3", $newScore, $username[0]["username"]);
                }
            }   
        }
        
        render("main_form.php");
    } 
    
    
    
    
    
?>
