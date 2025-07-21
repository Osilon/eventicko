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
  $event_id = intval($_GET['id']);
  
  $sql = "SELECT id, title, description, category, imageUrl, is_popular,
                 event_date, location, map_location, price, stock
          FROM events
          WHERE id = ?";
  
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $event_id);
  $stmt->execute();
  $result = $stmt->get_result();
  
  if ($result->num_rows > 0) {
    $event = $result->fetch_assoc();
    echo json_encode($event);
  } else {
    echo json_encode(["error" => "Event not found"]);
  }
  
  $stmt->close();
} else {
  $sql = "SELECT id, title, description, category, imageUrl, is_popular,
                 event_date, location, map_location, price, stock
          FROM events";

  $result = $conn->query($sql);

  $events = [];

  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      $events[] = $row;
    }
  }

  echo json_encode($events);
}

$conn->close();
?>