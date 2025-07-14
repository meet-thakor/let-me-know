import { initAWS } from './aws.js';
async function loadThreadsSecure() {
    try {

        const s3 = await initAWS();
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
            ${isLong ? `<div class="full-text-wrapper"><span class="full-text">${fullContent}</span></div>` : ""}
            ${isLong ? `<button class="read-more-btn">Read more</button>` : ""}
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

    // Activate "Read more" button functionality
    document.querySelectorAll(".read-more-btn").forEach(button => {
      button.addEventListener("click", () => {
        const contentBlock = button.closest(".bd-tw-content");
        contentBlock.querySelector(".short-text").style.display = "none";
        const fullTextWrapper = contentBlock.querySelector(".full-text-wrapper");
        fullTextWrapper.classList.add("expanded");
        button.remove();
      });
    });



    } catch (err) {
        console.error("Access denied or error fetching data.json:", err);
    }
}

// Call on page load
loadThreadsSecure();
