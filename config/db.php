<?php
// db.php
$host = 'localhost'; // or your DB server IP
$username = 'root';  // your database username
$password = '';      // your database password
$dbname = 'trauma_share';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Could not connect to the database $dbname :" . $e->getMessage());
}
?>

