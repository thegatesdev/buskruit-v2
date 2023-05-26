<?php

class gdb_login_settings
{
    public function __construct(
        public string $usertable,
        public string $id_col,
        public string $name_col,
        public string $pwd_col
    ){}
}

function gdb_sanitize(mysqli $conn, string $input){
    return mysqli_real_escape_string($conn,$input);
}

/**
 * Validates the inputted username and password against the columns from the login settings.
 * This returns the user id if the username and passwords match.
 * This may rehash passwords that require rehashing, but only when validated.
 */
function gdb_validate(mysqli $conn, gdb_login_settings $s, string $input_username, string $input_pwd)
{
    // Sanitize user input
    $input_username = gdb_sanitize($conn, $input_username);
    $input_pwd = gdb_sanitize($conn, $input_pwd);

    // Get hash in database
    $result = mysqli_query($conn, "SELECT $s->pwd_col, $s->id_col FROM $s->usertable WHERE $s->name_col='$input_username' LIMIT 1");
    if (mysqli_num_rows($result) != 1) return false;
    $user = mysqli_fetch_array($result);

    $user_hash = $user[0];
    $user_id = $user[1];

    // Validate against user input
    $valid = password_verify($input_pwd, $user_hash);
    if (!$valid) return false;

    // Rehash if necessary
    if (password_needs_rehash($user_hash, PASSWORD_DEFAULT)) {
        $new_hash = password_hash($input_pwd, PASSWORD_DEFAULT);
        mysqli_query($conn, "UPDATE $s->usertable SET $s->pwd_col='$new_hash' WHERE $s->id_col=$user_id");
    }
    return $user_id;
}

/**
 * Check if this username exists in the columns from the login settings.
 */
function gdb_user_exists(mysqli $conn, gdb_login_settings $s, string $input_username){
    // Sanitize user input
    $input_username = gdb_sanitize($conn, $input_username);
    // Query amount of rows with this username
    return mysqli_num_rows(
        mysqli_query($conn, "SELECT 1 FROM $s->usertable WHERE $s->name_col='$input_username'")
    ) > 0;
}

/**
 * Update or create a new user with the password hash of the input password.
 * This updates the password if the user exists, if not it creates a new user with this password.
 */
function gdb_update(mysqli $conn, gdb_login_settings $s, string $input_username, string $input_pwd)
{
    // Sanitize user input
    $input_username = gdb_sanitize($conn, $input_username);
    $input_pwd = gdb_sanitize($conn, $input_pwd);

    // Hash new password
    $hash = password_hash($input_pwd, PASSWORD_DEFAULT);

    // Update password, or insert new user if not exists
    $query_insert = "INSERT INTO $s->usertable ($s->name_col, $s->pwd_col) 
        VALUES ('$input_username', '$hash')
        ON DUPLICATE KEY UPDATE $s->pwd_col=$hash";
    return mysqli_query($conn, $query_insert) !== false;
}

/**
 * Create a settings object for the table name, and name and password columns.
 */
function gdb_settings_login(string $user_table, string $id_column, string $name_column, string $password_column){
    return new gdb_login_settings($user_table, $id_column, $name_column, $password_column);
}
