<!DOCTYPE html>

<html>
    <head>
        <link href="css/bootstrap.min.css" rel="stylesheet"/>
        <link href="css/bootstrap-theme.min.css" rel="stylesheet"/>
        <link href="css/math.css" rel="stylesheet"/>
        <script src="https://www.google.com/jsapi"></script>
        <script src="js/jquery-1.10.2.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/math.js"></script>
        <script src="js/submit.js"></script>
        <title>Fast Math</title>
    </head>
    <body>
        <div id="top">
        Fast Math
        </div>
        <?php if (isset($_SESSION["id"])): ?>
        <div>
        You are currently logged in.  <a href="logout.php">Log out</a>
        </div>
        <?php endif ?>
        <?php if (!isset($_SESSION["id"])): ?>
        <div>
        You are not currently logged in.  <a href="login.php">Log in</a>
        </div>
        <?php endif ?>
        <div class="container"; id="mid">
