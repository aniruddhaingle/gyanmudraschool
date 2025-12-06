<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "school_db";

// DB connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Database connection failed: " . $conn->connect_error);
}
?>
