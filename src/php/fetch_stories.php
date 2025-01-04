<?php
// fetch_stories.php
include '../config/db.php';

$query = "SELECT alias, story, created_at FROM stories ORDER BY created_at DESC LIMIT 10";
$stmt = $pdo->query($query);

$stories = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $stories[] = $row;
}

echo json_encode($stories);
?>

