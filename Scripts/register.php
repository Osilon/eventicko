<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "eventicko_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_POST['email'] && $_POST['password'] && $_POST['full_name']) {
    $email = $_POST['email'];
    $full_name = $_POST['full_name'];
    $phone_number = $_POST['phone_number'] ?? '';
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        header('Location: ../Pages/account.html?error=Email already registered');
        exit;
    }
    
    $stmt = $conn->prepare("INSERT INTO users (email, full_name, password, phone_number) VALUES (?, ?, ?, ?)");
    
    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("ssss", $email, $full_name, $password, $phone_number);
    
    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $full_name;
        $_SESSION['user_email'] = $email;
        header('Location: ../Pages/tickets.html');
    } else {
        echo "Error: " . $stmt->error;
        header('Location: ../Pages/account.html?error=Registration failed: ' . $stmt->error);
    }
    
    $stmt->close();
}

$conn->close();
?>