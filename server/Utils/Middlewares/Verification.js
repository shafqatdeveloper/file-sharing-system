import nodemailer from "nodemailer";

export const sendEmailVerificationToken = async (options) => {
  console.log(options);
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
    subject: `Verify your Email`,
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
            a {
              color: #3274d9;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              background-color: #4CAF50;
              color: white;
              border-radius: 5px;
              text-align: center;
            }
            .button:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2>Hello,</h2>
            <p>Click on the link below to verify your email:</p>
            <a href="https://absfhc.com/verify-email/${options.verificationToken}" class="button">Verify Email</a>
            <p>Best regards,<br> <strong>ARCHI ESIGN</strong></p>
          </div>
        </body>
      </html>
    `,
  };
  await transporter.sendMail(mailOptions);
};
