// aws-init.js
export async function initAWS() {
  return new Promise((resolve, reject) => {
    // Load AWS SDK if not already loaded
    if (!window.AWS) {
      const script = document.createElement('script');
      script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.1483.0.min.js";
      script.onload = configureAWS;
      script.onerror = () => reject("AWS SDK failed to load");
      document.head.appendChild(script);
    } else {
      configureAWS();
    }

    function configureAWS() {
      AWS.config.region = 'us-east-1';
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:51a0383b-a60c-4522-bd80-33c53115edeb'
      });

      AWS.config.credentials.get((err) => {
        if (err) {
          reject("Failed to authenticate with Cognito");
        } else {
          const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
          resolve(s3);
        }
      });
    }
  });
}
