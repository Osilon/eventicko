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

$searchQuery = isset($_GET['query']) ? trim($_GET['query']) : '';
$searchLocation = isset($_GET['location']) ? trim($_GET['location']) : '';

$sql = "SELECT id, title, description, category, imageUrl, is_popular,
               event_date, location, map_location, price, stock
        FROM events
        WHERE 1=1";

$params = [];
$types = "";

if (!empty($searchQuery)) {
  $sql .= " AND title LIKE ?";
  $searchTerm = "%" . $searchQuery . "%";
  $params[] = $searchTerm;
  $types .= "s";
}

if (!empty($searchLocation)) {
  $sql .= " AND location LIKE ?";
  $locationTerm = "%" . $searchLocation . "%";
  $params[] = $locationTerm;
  $types .= "s";
}

$sql .= " ORDER BY is_popular DESC, event_date ASC";

if (!empty($params)) {
  $stmt = $conn->prepare($sql);
  $stmt->bind_param($types, ...$params);
  $stmt->execute();
  $result = $stmt->get_result();
} else {
  $result = $conn->query($sql);
}

$events = [];

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $events[] = $row;
  }
}

echo json_encode($events);

if (isset($stmt)) {
  $stmt->close();
}
$conn->close();
?>