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

// Get search parameters
$searchQuery = isset($_GET['query']) ? trim($_GET['query']) : '';
$searchLocation = isset($_GET['location']) ? trim($_GET['location']) : '';

// Build the SQL query
$sql = "SELECT id, title, description, category, imageUrl, is_popular,
               event_date, location, map_location, price, stock
        FROM events
        WHERE 1=1";

$params = [];
$types = "";

// Add search conditions - only search by TITLE (not description)
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

// Add ordering
$sql .= " ORDER BY is_popular DESC, event_date ASC";

// Prepare and execute the statement
if (!empty($params)) {
  $stmt = $conn->prepare($sql);
  $stmt->bind_param($types, ...$params);
  $stmt->execute();
  $result = $stmt->get_result();
} else {
  // If no search parameters, return all events
  $result = $conn->query($sql);
}

$events = [];

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $events[] = $row;
  }
}

echo json_encode($events);

// Close connections
if (isset($stmt)) {
  $stmt->close();
}
$conn->close();
?>