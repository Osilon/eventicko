<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "eventicko_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die(json_encode(["success" => false, "error" => "Database connection error"]));
}

$event_id = isset($_POST['event_id']) ? intval($_POST['event_id']) : 0;
$customer_name = isset($_POST['customer_name']) ? trim($_POST['customer_name']) : '';
$customer_email = isset($_POST['customer_email']) ? trim($_POST['customer_email']) : '';
$customer_phone = isset($_POST['customer_phone']) ? trim($_POST['customer_phone']) : '';

if (empty($customer_name) || empty($customer_email) || $event_id == 0) {
  die(json_encode(["success" => false, "error" => "Please fill in all required fields"]));
}

$check_sql = "SELECT stock FROM events WHERE id = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("i", $event_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows == 0) {
  die(json_encode(["success" => false, "error" => "Event not found"]));
}

$event = $check_result->fetch_assoc();
if ($event['stock'] <= 0) {
  die(json_encode(["success" => false, "error" => "Sorry, this event is sold out"]));
}

$ticket_code = 'TKT-' . strtoupper(uniqid());

$conn->begin_transaction();

try {
  $insert_sql = "INSERT INTO tickets (event_id, customer_name, customer_email, customer_phone, ticket_code) 
                 VALUES (?, ?, ?, ?, ?)";
  $insert_stmt = $conn->prepare($insert_sql);
  $insert_stmt->bind_param("issss", $event_id, $customer_name, $customer_email, $customer_phone, $ticket_code);
  
  if (!$insert_stmt->execute()) {
    throw new Exception("Failed to create ticket");
  }
  
  $update_sql = "UPDATE events SET stock = stock - 1 WHERE id = ?";
  $update_stmt = $conn->prepare($update_sql);
  $update_stmt->bind_param("i", $event_id);
  
  if (!$update_stmt->execute()) {
    throw new Exception("Failed to update stock");
  }
  
  $conn->commit();
  
  echo json_encode([
    "success" => true,
    "ticket_code" => $ticket_code
  ]);
  
} catch (Exception $e) {
  $conn->rollback();
  echo json_encode([
    "success" => false,
    "error" => "Failed to process purchase: " . $e->getMessage()
  ]);
}

$conn->close();
?>