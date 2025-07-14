import { initAWS } from './aws.js';

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".submit-button");

  if (!buttons.length) {
    console.warn("No submit buttons found.");
    return;
  }

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const container = button.closest('.masterclass-content');
      if (!container) {
        alert("Form container not found.");
        return;
      }

      const name = container.querySelector('input')?.value.trim() || "Anonymous";
      const story = container.querySelector('textarea')?.value.trim();

      if (!story) {
        alert("Please write something before submitting.");
        return;
      }

      const newEntry = {
        id: Date.now().toString(),
        username: name,
        content: story,
        likes: 0,
        link: "#"
      };

      try {
        const s3 = await initAWS();

        const existing = await s3.getObject({
          Bucket: 'let-me-know-datapool',
          Key: 'data.json'
        }).promise();

        const json = JSON.parse(existing.Body.toString('utf-8'));
        json.unshift(newEntry);

        await s3.putObject({
          Bucket: 'let-me-know-datapool',
          Key: 'data.json',
          Body: JSON.stringify(json, null, 2),
          ContentType: 'application/json'
        }).promise();

        alert("Your story was submitted!");
        container.querySelector('input').value = "";
        container.querySelector('textarea').value = "";

      } catch (err) {
        console.error("Error writing to S3:", err);
        alert("Something went wrong. See console for details.");
      }
    });
  });
});
