import { initAWS } from './aws.js';

function showMessage(container, type, text) {
  const messageBox = container.querySelector(`#${type}Message`);
  const messageText = container.querySelector(`#${type}Text`);

  if (messageBox && messageText) {
    messageText.textContent = text;
    messageBox.classList.remove("is-hidden");

    // Close button
    const closeBtn = messageBox.querySelector(".delete");
    if (closeBtn) {
      closeBtn.onclick = () => messageBox.classList.add("is-hidden");
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageBox.classList.add("is-hidden");
    }, 5000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".submit-button");

  if (!buttons.length) {
    console.warn("No submit buttons found.");
    return;
  }

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const container = button.closest('.masterclass-content');
      const input = container.querySelector('input');
      const textarea = container.querySelector('textarea');

      if (!container || !input || !textarea) {
        console.error("Form elements not found.");
        return;
      }

      const rawName = input.value.trim() || "Anonymous";
      const story = textarea.value.trim();

      if (!story) {
        showMessage(container, "error", "Please write something before submitting.");
        return;
      }

      // Sanitize name
      let baseUsername = rawName.replace(/\s+/g, '').toLowerCase() || "anon";

      // Disable button and show loading
      button.classList.add("is-disabled");
      button.innerHTML = `<span class="loader"></span>`;

      try {
        const s3 = await initAWS();
        const existing = await s3.getObject({
          Bucket: 'let-me-know-datapool',
          Key: 'data.json'
        }).promise();

        const json = JSON.parse(existing.Body.toString('utf-8'));

        // Ensure unique username
        let finalUsername = baseUsername;
        let attempt = 0;
        while (json.some(entry => entry.username === finalUsername)) {
          finalUsername = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;
          if (++attempt > 5) break;
        }

        const newEntry = {
          username: finalUsername,
          content: story,
          likes: 0
        };

        json.unshift(newEntry);

        await s3.putObject({
          Bucket: 'let-me-know-datapool',
          Key: 'data.json',
          Body: JSON.stringify(json, null, 2),
          ContentType: 'application/json'
        }).promise();

        // Set final username in input and placeholder
        input.value = finalUsername;
        input.placeholder = `Submitted as: ${finalUsername}`;
        textarea.value = "";

        showMessage(container, "success", `Story submitted as "${finalUsername}"`);
        

      } catch (err) {
        console.error("Error writing to S3:", err);
        showMessage(container, "error", "Something went wrong. Please try again.");
      } finally {
        button.classList.remove("is-disabled");
        button.innerHTML = `<span>Submit</span>`;
      }
    });
  });
});
