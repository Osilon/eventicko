<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "eventicko_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($_POST['email'] && $_POST['password']) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    $stmt = $conn->prepare("SELECT id, full_name, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['full_name'];
            $_SESSION['user_email'] = $email;
            header('Location: ../Pages/tickets.html');
        } else {
            header('Location: ../Pages/account.html?error=Invalid password');
        }
    } else {
        header('Location: ../Pages/account.html?error=User not found');
    }
}
?>