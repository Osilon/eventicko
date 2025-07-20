<?php
// --- CORS & Content-Type Headers ---
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "eventicko_db"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  error_log("Database Connection failed: " . $conn->connect_error);
  die(json_encode(["error" => "Database connection error. Please try again later."]));
}

// SQL query to fetch ALL blog posts with ALL content
// This will send 'content' for all posts to the client, even for the list view.
$sql = "SELECT id, title, short_content, content, image_url, author, publish_date FROM blogs ORDER BY publish_date DESC";

$result = $conn->query($sql);

$blogs = [];

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $blogs[] = $row;
  }
}

echo json_encode($blogs);

// Close connection
$conn->close();
?>