<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Upload Gallery Image</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background-color: #f2f4f7;
      padding-top: 40px;
    }
    .upload-form {
      max-width: 600px;
      margin: auto;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h2 {
      text-align: center;
      color: #1a73e8;
    }
  </style>
</head>
<body>

<div class="upload-form">
  <h2>Upload New Gallery Image</h2>
  <form action="upload_gallery.php" method="POST" enctype="multipart/form-data">
    <div class="mb-3">
      <label class="form-label">Select Category</label>
      <select name="category" class="form-select" required>
        <option value="">--Select Category--</option>
        <option value="festival">Festival</option>
        <option value="tour">Educational Tour</option>
        <option value="culture">Cultural</option>
        <option value="yoga">Yoga</option>
        <option value="rakhi">Rakhi Making</option>
        <option value="rangoli">Rangoli Making</option>
      </select>
    </div>
    <div class="mb-3">
      <label class="form-label">Select Image</label>
      <input type="file" name="photo" class="form-control" accept="image/*" required>
    </div>
    <div class="text-center">
      <button type="submit" class="btn btn-primary">Upload</button>
    </div>
  </form>
</div>

</body>
</html>
