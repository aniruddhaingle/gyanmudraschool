<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: admin_login.html");
    exit();
}

include 'db.php';

// Fetch student admission records
$sql = "SELECT * FROM admissions ORDER BY id DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Dashboard - Gyan Mudra Academy</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- DataTables CSS -->
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.5/css/dataTables.bootstrap5.min.css">

  <style>
    body {
      background-color: #f4f7fb;
    }
    .header {
      text-align: center; 
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .header h2 {
      color: #1a73e8;
      font-weight: 700;
    }
    .btn-group-custom {
      max-width: 700px;
      margin: 0 auto 30px auto;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      justify-content: center;
    }
    .record-table {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.08);
    }
    img {
      object-fit: cover;
      border-radius: 6px;
    }
    .action-btns a {
      margin-right: 6px;
    }
  </style>
</head>
<body>

<div class="container">

  <div class="header">
    <h2>Welcome, Admin - Gyan Mudra Academy</h2>
  </div>

  <div class="btn-group-custom">
    <a href="admin_upload.php" class="btn btn-success">🖼️ Upload Gallery Image</a>
    <a href="logout.php" class="btn btn-danger" onclick="return confirm('Are you sure you want to logout?');">🔓 Logout</a>
  </div>

  <div class="record-table mt-4">
    <h4 class="mb-3 text-center">📄 Admission Records</h4>

    <table id="recordsTable" class="table table-bordered table-hover table-striped align-middle">
      <thead class="table-primary text-center">
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Father's Name</th>
          <th>Caste</th>
          <th>Gender</th>
          <th>Address</th>
          <th>Photo</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php if ($result && $result->num_rows > 0): ?>
          <?php while($row = $result->fetch_assoc()): ?>
            <tr>
              <td><?= htmlspecialchars($row['id']) ?></td>
              <td><?= htmlspecialchars($row['first_name']) ?></td>
              <td><?= htmlspecialchars($row['last_name']) ?></td>
              <td><?= htmlspecialchars($row['father_name']) ?></td>
              <td><?= htmlspecialchars($row['caste']) ?></td>
              <td><?= htmlspecialchars($row['gender']) ?></td>
              <td><?= htmlspecialchars($row['address']) ?></td>
              <td>
                <?php if (!empty($row['photo'])): ?>
                  <img src="<?= htmlspecialchars($row['photo']) ?>" width="80" height="80" alt="Student Photo">
                <?php else: ?>
                  <span class="text-muted">No Photo</span>
                <?php endif; ?>
              </td>
              <td class="text-center action-btns">
                <a href="edit_entry.php?id=<?= urlencode($row['id']) ?>" class="btn btn-sm btn-warning">✏️ Edit</a>
                <a href="delete_entry.php?id=<?= urlencode($row['id']) ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this record?');">🗑️ Delete</a>
              </td>
            </tr>
          <?php endwhile; ?>
        <?php else: ?>
          <tr><td colspan="9" class="text-center">No records found</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- Bootstrap & DataTables JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.5/js/dataTables.bootstrap5.min.js"></script>
<script>
  $(document).ready(function() {
    $('#recordsTable').DataTable({
      "pageLength": 5,
      "lengthMenu": [5, 10, 25, 50],
      "order": [[0, "desc"]]
    });
  });
</script>
</body>
</html>
<?php $conn->close(); ?>
