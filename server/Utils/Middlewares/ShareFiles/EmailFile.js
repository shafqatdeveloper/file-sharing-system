import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const EmailPDFFIle = async (options) => {
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

  const generateFileLinksHTML = (fileLinks) => {
    return fileLinks
      .map(
        (link) =>
          `<a href="${link}" download>Download ${decodeURIComponent(
            path.basename(link)
          )}</a><br>`
      )
      .join("");
  };

  const fileLinksHTML = generateFileLinksHTML(options.fileLinks);
  const emailBody = htmlTemplate
    .replace("{{senderName}}", options.sender)
    .replace("{{loopName}}", options.folderName)
    .replace(
      "{{documentLink}}",
      `http://localhost:5173/folder/view/${options.folderId}`
    )
    .replace("{{fileLinks}}", fileLinksHTML);

  const mailOptions = {
    from: "info@alleviacare.com",
    to: options.email,
    subject: `Verify your Email`,
    html: emailBody,
  };
  await transporter.sendMail(mailOptions);
};
