<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "eventicko_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    error_log("Database Connection failed: " . $conn->connect_error);
    die(json_encode(["error" => "Database connection error. Please try again later."]));
}

$sql = "SELECT id, title, description, category, imageUrl, is_popular,
               event_date, location, map_location, price, stock
        FROM events";

$result = $conn->query($sql);

$events = [];

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $events[] = $row; // Add each row (event) to the events array
    }
}

echo json_encode($events);

// Close connection
$conn->close();
?>