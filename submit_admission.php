  <?php
  $host = "localhost";
  $user = "root";
  $pass = "";
  $dbname = "school_db";

  $conn = new mysqli($host, $user, $pass, $dbname);
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  $first_name = $_POST['first_name'];
  $last_name = $_POST['last_name'];
  $father_name = $_POST['father_name'];
  $caste = $_POST['caste'];
  $gender = $_POST['gender'];
  $address = $_POST['address'];

  $photo_name = $_FILES['photo']['name'];
  $photo_tmp = $_FILES['photo']['tmp_name'];
  $upload_dir = "uploads/";
  $photo_path = $upload_dir . basename($photo_name);

  if (move_uploaded_file($photo_tmp, $photo_path)) {
    $stmt = $conn->prepare("INSERT INTO admissions (first_name, last_name, father_name, caste, gender, address, photo) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $first_name, $last_name, $father_name, $caste, $gender, $address, $photo_path);

    if ($stmt->execute()) {
      echo "<h2 style='color:green'>Admission Submitted Successfully!</h2>";
    } else {
      echo "Error: " . $stmt->error;
    }
    $stmt->close();
  } else {
    echo "Failed to upload photo.";
  }
  $conn->close();
  ?>
  