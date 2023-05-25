<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
        $default_css = array("main", "theme");
        // Set page title
        echo "<title>" . ($page_title ?? "No title") . "</title>";

        // Set css files, always include main
        if (isset($page_css)) $page_css = array_merge($page_css, $default_css);
        else $page_css = $default_css;
        foreach ($page_css as $css_name){
            echo "<link type='text/css' rel='stylesheet' href='./css/$css_name.css'>";
        }

        if (isset($page_js)) foreach($page_js as $js_name){
            echo "<script defer async src='./js/$js_name.js'></script>";
        }
    ?>
</head>