const passwordReset = (name,link) => {
    return `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Password Update Confirmation</title>
          <style>
              body {
                  background-color: #ffffff;
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.4;
                  color: #333333;
                  margin: 0;
                  padding: 0;
              }
      
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  text-align: center;
              }
      
              .logo {
                  max-width: 200px;
                  margin-bottom: 20px;
              }
      
              .message {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 20px;
              }
      
              .body {
                  font-size: 16px;
                  margin-bottom: 20px;
              }
      
              .support {
                  font-size: 14px;
                  color: #999999;
                  margin-top: 20px;
              }
      
              .highlight {
                  font-weight: bold;
              }
          </style>
      
      </head>
      
      <body>
          <div class="container">
              <a href="https://edtechplatform.netlify.app/"><img class="logo"
                      src="https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?cs=srgb&dl=pexels-pixabay-159866.jpg&fm=jpg" alt="StudyNotion Logo"></a>
              <div class="message">Password Reset Link</div>
              <div class="body">
                  <p>Hey ${name},</p>
                  <p>To reset password click :- <span class="highlight"><a href="${link}">here</a></span>.
                  </p>
                  <p>If you did not request this password reset, please contact us immediately to secure your account.</p>
              </div>
              <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
                  at
                  <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!
              </div>
          </div>
      </body>
      
      </html>`;
  };
  
  module.exports = passwordReset;
  