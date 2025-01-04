document.getElementById('story-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const alias = document.getElementById('alias').value;
  const story = document.getElementById('story').value;

  if (story.trim() === "") {
    alert("Please share your story before submitting.");
    return;
  }

  // Submit the story to the PHP backend
  fetch('src/php/submit_story.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      alias: alias,
      story: story
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Your story has been submitted anonymously!');
        window.location.href = '/';
      } else {
        alert('There was an error submitting your story. Please try again.');
      }
    })
    .catch(error => console.error('Error:', error));
});

