<?php

function jsonExitError($title = "", $message = ""){
    echo json_encode([
        "ok" => false,
        "error" => ["title" => $title, "msg" => $message]
    ]);
    exit;
}

function jsonExitOk($content = null){
    $obj = ["ok" => true];
    if (isset($content)) $obj['content'] = $content;
    echo json_encode($obj);
    exit;
}