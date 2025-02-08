<?php
// include language configuration file based on selected language
$langArray = ["en", "sp", "gr", "it", "ru", "ch", "fr", "ar", "jp"];
$lng = "en";
if (isset($_GET['lang'])) {
    $lng = $_GET['lang'];
    if (in_array($lng, $langArray)) {
        $_SESSION['lang'] = $lng;
    } else {
        $_SESSION['lang'] = 'en';
    }
}
if(isset($_SESSION['lang'])) {
    $lng = $_SESSION['lang'];
} else {
    $lng = "en";
}
?>
