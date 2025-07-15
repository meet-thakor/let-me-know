import { initAWS } from './aws.js';
import { loadThreadsSecure } from './fetch.js';
async function handleLikeClick(event) {
  event.preventDefault();

  const likeBtn = event.currentTarget;
  const username = likeBtn.dataset.username;

  try {
    const s3 = await initAWS();

    // Step 1: Fetch current threads
    const dataObj = await s3.getObject({
      Bucket: 'let-me-know-datapool',
      Key: 'data.json'
    }).promise();

    const threads = JSON.parse(dataObj.Body.toString('utf-8'));

    // Step 2: Find thread by username
    const thread = threads.find(t => t.username === username);
    if (!thread) return;

    thread.likes += 1;

    // Step 3: Save updated list
    await s3.putObject({
      Bucket: 'let-me-know-datapool',
      Key: 'data.json',
      Body: JSON.stringify(threads, null, 2),
      ContentType: 'application/json'
    }).promise();

    // Step 4: Update UI immediately
    likeBtn.querySelector('.bd-tw-action-stat').textContent = thread.likes;

  } catch (err) {
    console.error("Error updating likes:", err);
    alert("Could not update like. See console for details.");
  }
}

function attachLikeListeners() {
  document.querySelectorAll('.bd-tw-action-link').forEach(btn => {
    btn.addEventListener('click', handleLikeClick);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadThreadsSecure();
  attachLikeListeners();
});
