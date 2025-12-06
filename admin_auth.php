<?php
session_start();

// Hardcoded credentials
$admin_username = "admin";
$admin_password = "12345";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($username === $admin_username && $password === $admin_password) {
        $_SESSION['admin_logged_in'] = true;
        header("Location: admin_dashboard.php");
        exit();
    } else {
        echo "<h3 style='color:red; text-align:center;'>Invalid username or password</h3>";
        echo "<p style='text-align:center;'><a href='admin_login.html'>Try Again</a></p>";
    }
} else {
    header("Location: admin_login.html");
    exit();
}
?>
