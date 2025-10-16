// emailTemplates.js

export const registerEmailTemplate = (name, email) => {
  return `
  <!DOCTYPE html>
  <html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f7f8fa;
        color: #333;
      }
      .container {
        max-width: 600px;
        background-color: #ffffff;
        margin: 40px auto;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .header {
        background: linear-gradient(135deg, #4f46e5, #3b82f6);
        padding: 30px 20px;
        text-align: center;
        color: white;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
      }
      .content {
        padding: 30px 25px;
        line-height: 1.6;
      }
      .content h2 {
        color: #111827;
        font-size: 22px;
        margin-bottom: 10px;
      }
      .content p {
        margin: 10px 0;
        font-size: 16px;
      }
      .btn {
        display: inline-block;
        background-color: #4f46e5;
        color: white !important;
        padding: 12px 25px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        margin-top: 20px;
      }
      .footer {
        background-color: #f3f4f6;
        text-align: center;
        padding: 15px;
        font-size: 14px;
        color: #6b7280;
      }
      @media (max-width: 600px) {
        .content {
          padding: 20px;
        }
        .header h1 {
          font-size: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Our Platform 🚀</h1>
      </div>
      <div class="content">
        <h2>Hi ${name},</h2>
        <p>We’re thrilled to have you onboard! Your account has been successfully created using the email:</p>
        <p><strong>${email}</strong></p>
        <p>Start exploring and enjoy all the features our platform offers.</p>
        <a href="#" class="btn">Visit Dashboard</a>
        <p style="margin-top: 25px;">If you have any questions, feel free to reply to this email — we're here to help.</p>
        <p>Cheers,<br>The Support Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Our Platform. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
