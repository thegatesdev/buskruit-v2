<?php

session_start();

session_destroy();
session_unset();
session_gc();

header("Location:index.php");