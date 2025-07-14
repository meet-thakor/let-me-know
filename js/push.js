<script src="https://sdk.amazonaws.com/js/aws-sdk-2.1483.0.min.js"></script>
// AWS Configuration
    AWS.config.region = 'us-east-1'; 
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:51a0383b-a60c-4522-bd80-33c53115edeb'
    });

    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: 'let-me-know-datapool' }
    });

    document.querySelector('.shine span').addEventListener('click', async () => {
      const container = document.querySelector('.masterclass-content');
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
        // Step 1: Load existing data
        const existing = await s3.getObject({
          Bucket: 'let-me-know-datapool',
          Key: 'data.json'
        }).promise();

        const json = JSON.parse(existing.Body.toString('utf-8'));
        json.unshift(newEntry); // Add to top

        // Step 2: Save back to S3
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