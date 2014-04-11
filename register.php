<?php

    // configuration
    require("./includes/config.php");

    // if form was submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
       //if username empty
       if ($_POST["username"] == NULL)
       {
           apologize("Please enter a username.");
       }
       //if password empty
       else if ($_POST["password"] == NULL)
       {
           apologize("Please enter a password.");
       } 
       //if passwords don't match
       else if ($_POST["password"] != $_POST["confirmation"])
       {
           apologize("Your passwords did not match.  Please try again.");
       }
       
       //create new user
       else
       {
          $result = query("INSERT INTO users (username, hash, escore, nscore, hscore, gscore) VALUES(?, ?, 0, 0, 0, 0)", $_POST["username"], crypt($_POST["password"]));
          if ($result === FALSE)
          {
              apologize("Username taken, please try another.");
          }
          
          else
          {
              query("INSERT INTO users (username, hash, escore, nscore, hscore, gscore) VALUES(?, ?, 0, 0, 0, 0)", $_POST["username"], crypt($_POST["password"]));
              $rows = query("SELECT LAST_INSERT_ID() AS id");
              $id = $rows[0]["id"];
              $_SESSION["id"] = $id;
              redirect("index.php");
          }
       } 
    }
    
    else
    {
        // else render form
        render("register_form.php", ["title" => "Register"]);
    }

?>
