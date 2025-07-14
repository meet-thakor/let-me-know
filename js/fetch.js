  // AWS Cognito configuration
  AWS.config.region = 'us-east-1';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:51a0383b-a60c-4522-bd80-33c53115edeb'
  });

  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

  async function loadThreadsSecure() {
    try {
      // Fetch JSON from S3 using signed credentials
      const result = await s3.getObject({
        Bucket: 'let-me-know-datapool',
        Key: 'data.json'
      }).promise();

      const threads = JSON.parse(result.Body.toString('utf-8'));
      const list = document.getElementById("threadList");

      threads.forEach(thread => {
        const article = document.createElement("article");
        article.className = "bd-tw";
        article.setAttribute("data-likes", thread.likes);
        article.setAttribute("data-id", thread.id);

        const fullContent = thread.content;
        const maxLength = 180;
        const isLong = fullContent.length > maxLength;
        const shortContent = isLong ? fullContent.slice(0, maxLength) + "..." : fullContent;

        const contentHTML = `
          <div class="bd-tw-content">
            <span class="short-text">${shortContent}</span>
            ${isLong ? `<span class="full-text-wrapper" style="display:none;"><span class="full-text">${fullContent}</span></span>` : ""}
            ${isLong ? `<button class="read-more-btn" style="margin-top: 0.5rem; background-color: #eee; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;">Read more</button>` : ""}
          </div>
        `;

        article.innerHTML = `
          <header class="bd-tw-header">
            <div class="bd-tw-name">
              <strong class="bd-tw-fullname">@${thread.username}</strong>
            </div>
          </header>
          ${contentHTML}
          <ul class="bd-tw-actions">
            <li class="bd-tw-action is-heart">
              <a class="bd-tw-action-link" href="${thread.link}" target="_blank">
                <div class="bd-tw-icon"></div>
                <span class="bd-tw-action-stat">${thread.likes}</span>
              </a>
            </li>
          </ul>
        `;

        list.appendChild(article);
      });

      // Handle Read More click
      document.querySelectorAll(".read-more-btn").forEach(button => {
        button.addEventListener("click", () => {
          const contentBlock = button.closest(".bd-tw-content");
          const shortText = contentBlock.querySelector(".short-text");
          const fullTextWrapper = contentBlock.querySelector(".full-text-wrapper");

          shortText.style.display = "none";
          fullTextWrapper.style.display = "inline-block";

          fullTextWrapper.animate([
            { opacity: 0, transform: 'translateY(5px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], {
            duration: 300,
            easing: 'ease-out'
          });

          button.remove();
        });
      });

    } catch (err) {
      console.error("Access denied or error fetching data.json:", err);
    }
  }

  // Call on page load
  loadThreadsSecure();