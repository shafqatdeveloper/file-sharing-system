import nodemailer from "nodemailer";

export const sendInvitationEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    secure: true,
    secureConnection: false,
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    port: 465,
    debug: true,
    connectionTimeout: 10000,
    auth: {
      user: "info@alleviacare.com",
      pass: "Money2024@", // Consider using environment variables to keep credentials secure
    },
  });

  const mailOptions = {
    from: "info@alleviacare.com",
    to: options.email,
    subject: `You're Invited to Join Our Website!`,
    html: `
      <html>
        <head>
          <style>
            body {
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .email-container {
              max-width: 600px;
              margin: auto;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #3274d9;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              color: white;
              text-align: center;
            }
            .header h1 {
              margin: 0;
            }
            .content {
              padding: 20px;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              background-color: #4CAF50;
              color: white;
              border-radius: 5px;
              text-align: center;
              text-decoration: none;
            }
            .button:hover {
              background-color: #45a049;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 0.9em;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>You're Invited!</h1>
            </div>
            <div class="content">
              <h2>Hello,</h2>
              <p>${options.senderName} has invited you to join <strong>ARCHI ESIGN</strong>. Click the link below to get started:</p>
              <a href="${options.baseUrl}/signup" class="button">Join Now</a>
              <p>If you have any questions, feel free to contact us at any time.</p>
              <p>Best regards,<br> <strong>ARCHI ESIGN</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ARCHI ESIGN. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
