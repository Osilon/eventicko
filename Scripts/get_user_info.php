<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "eventicko_db";
    
  $conn = new mysqli($servername, $username, $password, $dbname);
    
  $stmt = $conn->prepare("SELECT full_name, email, phone_number FROM users WHERE id = ?");
  $stmt->bind_param("i", $_SESSION['user_id']);
  $stmt->execute();
  $result = $stmt->get_result();
    
  if ($user = $result->fetch_assoc()) {
    echo json_encode([
      'logged_in' => true,
      'user' => $user
    ]);
  } else {
      echo json_encode(['logged_in' => false]);
  }
} else {
  echo json_encode(['logged_in' => false]);
}
?>