<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "school_db";

// Create DB connection
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$category = $_POST['category'];
$photo = $_FILES['photo']['name'];
$target = "gallery_uploads/" . basename($photo);

// Create folder if not exists
if (!is_dir("gallery_uploads")) {
  mkdir("gallery_uploads", 0777, true);
}

// Move the uploaded file
if (move_uploaded_file($_FILES['photo']['tmp_name'], $target)) {
  $sql = "INSERT INTO gallery (category, image_path) VALUES ('$category', '$photo')";
  if ($conn->query($sql) === TRUE) {
    echo "<h3 style='text-align:center; color:green;'>Image uploaded successfully.</h3>";
    echo "<p style='text-align:center;'><a href='admin_upload.php'>Upload another</a></p>";
  } else {
    echo "Database error: " . $conn->error;
  }
} else {
  echo "Failed to upload image.";
}

$conn->close();
?>
    