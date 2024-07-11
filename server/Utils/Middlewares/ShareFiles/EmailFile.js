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
  const htmlTemplate = fs.readFileSync(pathToHTMLTemplate, "utf-8");

  const signUpSection = options.recevierMember
    ? ""
    : `<div style="padding: 20px; background-color: #f5f5f5; margin-top: 20px; text-align: center;">
        <h2>Finish setting up your free account</h2>
        <p>${options.email}</p>
        <a href="https://absfhc.com/signup" class="button">Signup for Free</a>
      </div>`;
  const documentLinksHTML = options.singleFileLinks
    .map((link, index) => `<li><a href="${link}">File-${index + 1}</a></li>`)
    .join("");
  const linksSection = options.linkOnly
    ? `<ul class="file-links">${documentLinksHTML}</ul>`
    : "";
  const emailBody = htmlTemplate
    .replace("{{senderName}}", options.sender)
    .replace("{{loopName}}", options.folderName)
    .replace(
      "{{documentLink}}",
      `https://absfhc.com/folder/view/${options.folderId}`
    )
    .replace("{{fileLinks}}", linksSection)
    .replace("{{signUpInvitationSection}}", signUpSection);
  const attachments = options.fileOnly
    ? options.filePaths.map((filePath) => {
        const fileName = decodeURIComponent(path.basename(filePath));
        return {
          filename: fileName,
          path: filePath,
        };
      })
    : [];

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
  const htmlTemplate = fs.readFileSync(pathToHTMLTemplate, "utf-8");

  // Prepare the email content based on the options
  let htmlContent = htmlTemplate
    .replace("{{senderName}}", options.sender)
    .replace("{{loopName}}", options.folderName);

  if (options.linkOnly) {
    const documentLink = `<a href="https://absfhc.com/file/view/${options.fileId}" class="button">VIEW DOCUMENT</a>`;
    htmlContent = htmlContent.replace("{{documentLink}}", documentLink);
  } else {
    htmlContent = htmlContent.replace("{{documentLink}}", "");
  }

  if (options.recevierMember) {
    htmlContent = htmlContent.replace("{{additionalContent}}", "");
  } else {
    const signUpInvitationSection = `
      <div style="padding: 20px; background-color: #f5f5f5; margin-top: 20px; text-align: center;">
        <h2>Finish setting up your free account</h2>
        <p>${options.email}</p>
        <a href="https://absfhc.com/signup" class="button">Signup for Free</a>
      </div>
    `;
    htmlContent = htmlContent.replace(
      "{{signUpInvitationSection}}",
      signUpInvitationSection
    );
  }

  const mailOptions = {
    from: "info@alleviacare.com",
    to: options.email,
    subject: `"${options.sender}" sent you an attachment`,
    html: htmlContent,
    attachments: [],
  };

  if (options.fileOnly) {
    mailOptions.attachments.push({
      filename: options.fileName,
      path: options.filePath,
    });
  }

  await transporter.sendMail(mailOptions);
};
