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
      pass: "Money2024@",
    },
  });
  const mailOptions = {
    from: "info@alleviacare.com",
    to: options.email,
    subject: `Verify your Email`,
    html: `<p>Hello,</p>
             <p>Click on the link below to verify your email</p>
             <p><a href="https://absfhc.com./verify-email/${options.verificationToken}">https://absfhc.com./verify-email/${options.verificationToken}</a></p>
             <p>Best regards,<br>Your Company Name</p>`,
  };
  await transporter.sendMail(mailOptions);
};
