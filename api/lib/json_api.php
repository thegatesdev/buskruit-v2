<?php

function jsonExitError($message){
    echo json_encode([
        "ok" => false,
        "error" => $message
    ]);
    exit;
}

function jsonExitOk($content = null){
    $obj = ["ok" => true];
    if (isset($content)) $obj['content'] = $content;
    echo json_encode($obj);
    exit;
}