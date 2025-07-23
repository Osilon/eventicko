<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "eventicko_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  error_log("Database Connection failed: " . $conn->connect_error);
  die(json_encode(["error" => "Database connection error. Please try again later."]));
}

if (isset($_GET['id'])) {
  $blog_id = intval($_GET['id']);
  
  $sql = "SELECT id, title, short_content, content, image_url, author, publish_date
          FROM blogs
          WHERE id = ?";
  
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $blog_id);
  $stmt->execute();
  $result = $stmt->get_result();
  
  if ($result->num_rows > 0) {
    $blog = $result->fetch_assoc();
    echo json_encode($blog);
  } else {
    echo json_encode(["error" => "Blog post not found"]);
  }
  
  $stmt->close();
} else {
  $sql = "SELECT id, title, short_content, content, image_url, author, publish_date 
          FROM blogs 
          ORDER BY publish_date DESC";

  $result = $conn->query($sql);

  $blogs = [];

  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      $blogs[] = $row;
    }
  }

  echo json_encode($blogs);
}

$conn->close();
?>