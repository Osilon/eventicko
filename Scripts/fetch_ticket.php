<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "eventicko_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die(json_encode(["error" => "Database connection error"]));
}

$ticket_code = isset($_GET['code']) ? trim($_GET['code']) : '';

if (empty($ticket_code)) {
  die(json_encode(["error" => "No ticket code provided"]));
}

$sql = "SELECT t.*, e.title as event_title, e.event_date, e.location as event_location, e.price 
        FROM tickets t 
        JOIN events e ON t.event_id = e.id 
        WHERE t.ticket_code = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $ticket_code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  $ticket = $result->fetch_assoc();
  echo json_encode($ticket);
} else {
  echo json_encode(["error" => "Ticket not found"]);
}

$stmt->close();
$conn->close();
?>