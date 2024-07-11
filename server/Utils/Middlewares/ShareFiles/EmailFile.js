import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const EmailMultiplePDFFIle = async (options) => {
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
  const __dirname = path.resolve();
  const pathToHTMLTemplate = path.join(
    __dirname,
    "Utils",
    "Middlewares",
    "ShareFiles",
    "sharemultiplewithdocument.html"
  );
  console.log(pathToHTMLTemplate);
  const htmlTemplate = fs.readFileSync(pathToHTMLTemplate, "utf-8");
  const emailBody = htmlTemplate
    .replace("{{senderName}}", options.sender)
    .replace("{{loopName}}", options.folderName)
    .replace(
      "{{documentLink}}",
      `http://localhost:5173/folder/view/${options.folderId}`
    );

  const attachments = options.filePaths.map((filePath) => {
    const fileName = decodeURIComponent(path.basename(filePath));
    return {
      filename: fileName,
      path: filePath,
    };
  });

  console.log(attachments);

  const mailOptions = {
    from: "info@alleviacare.com",
    to: options.email,
    subject: `${options.sender} sent you attachements`,
    html: emailBody,
    attachments: attachments,
  };
  await transporter.sendMail(mailOptions);
};

export const EmailSinglePDFFIle = async (options) => {
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
  const __dirname = path.resolve();
  const pathToHTMLTemplate = path.join(
    __dirname,
    "Utils",
    "Middlewares",
    "ShareFiles",
    "sharesinglefile.html"
  );
  console.log(pathToHTMLTemplate);
  const htmlTemplate = fs.readFileSync(pathToHTMLTemplate, "utf-8");

  const mailOptions = {
    from: "info@alleviacare.com",
    to: options.email,
    subject: `"${options.sender}" sent you attachment`,
    html: htmlTemplate
      .replace("{{senderName}}", options.sender)
      .replace("{{loopName}}", options.folderName)
      .replace(
        "{{documentLink}}",
        `https://absfhc.com/file/view/${options.fileId}`
      ),
    attachments: [
      {
        filename: options.fileName,
        path: options.filePath,
      },
    ],
  };
  await transporter.sendMail(mailOptions);
};
