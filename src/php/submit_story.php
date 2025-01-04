<?php
// submit_story.php
include '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $alias = isset($_POST['alias']) ? trim($_POST['alias']) : null;
    $story = trim($_POST['story']);
    
    // Validate inputs
    if (empty($story)) {
        echo json_encode(['error' => 'Story cannot be empty.']);
        exit;
    }
    
    // If alias is empty, use "Anonymous"
    if (empty($alias)) {
        $alias = 'Anonymous';
    }
    
    // Prepare SQL query to insert the story
    $query = "INSERT INTO stories (alias, story) VALUES (:alias, :story)";
    $stmt = $pdo->prepare($query);
    
    // Execute query
    if ($stmt->execute([':alias' => $alias, ':story' => $story])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'There was an error submitting your story. Please try again.']);
    }
}
?>

