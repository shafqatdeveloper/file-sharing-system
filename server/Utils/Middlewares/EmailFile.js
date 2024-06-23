import nodemailer from "nodemailer";

export const SendFolderLink = async (options) => {
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
    to: options.receiver,
    subject: `info@alleviacare.com Shared you a Folder`,
    html: `<p>Hello,</p>
           <p>info@alleviacare.com Shared you a Folder. You can access it using the link below:</p>
           <p><a href="http://localhost:5173/folder/view/${options.folderId}">http://localhost:5173/folder/view/${options.folderId}</a></p>
           <p>Best regards,<br>Your Company Name</p>`,
  };
  await transporter.sendMail(mailOptions);
};

export const SendFileLink = async (options) => {
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
    to: options.receiver,
    subject: `info@alleviacare.com Sent you a File`,
    html: `<p>Hello,</p>
             <p>info@alleviacare.com has sent you a file. You can access it using the link below:</p>fileId
             <p><a href="http://localhost:5173/file/single/${options.fileId}">http://localhost:5173/file/single/${options.fileId}</a></p>
             <p>Best regards,<br>Your Company Name</p>`,
  };
  await transporter.sendMail(mailOptions);
};
