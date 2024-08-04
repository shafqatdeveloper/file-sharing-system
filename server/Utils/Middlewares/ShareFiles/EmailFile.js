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
  let htmlContent = htmlTemplate.replace("{{senderName}}", options.sender);

  if (options.linkOnly) {
    const documentLink = `<a href="https://absfhc.com/file/view/receiver/${options.fileId}?sender=${options.senderId}" class="button">VIEW DOCUMENT</a>`;
    htmlContent = htmlContent.replace("{{documentLink}}", documentLink);
  } else {
    htmlContent = htmlContent.replace("{{documentLink}}", "");
  }

  if (options.recevierMember) {
    htmlContent = htmlContent.replace("{{signUpInvitationSection}}", "");
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

export const EmailPDFFIleByReceiver = async (options) => {
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

  // const __dirname = path.resolve();
  // const pathToHTMLTemplate = path.join(
  //   __dirname,
  //   "Utils",
  //   "Middlewares",
  //   "ShareFiles",
  //   "sharesinglefile.html"
  // );
  // const htmlTemplate = fs.readFileSync(pathToHTMLTemplate, "utf-8");

  // // Prepare the email content based on the options
  // let htmlContent = htmlTemplate
  //   .replace("{{senderName}}", options.sender)
  //   .replace("{{loopName}}", options.folderName);

  // if (options.linkOnly) {
  //   const documentLink = `<a href="http://localhost:5173/file/view/receiver/${options.fileId}?sender=${options.senderId}" class="button">VIEW DOCUMENT</a>`;
  //   htmlContent = htmlContent.replace("{{documentLink}}", documentLink);
  // } else {
  //   htmlContent = htmlContent.replace("{{documentLink}}", "");
  // }

  // if (options.recevierMember) {
  //   htmlContent = htmlContent.replace("{{additionalContent}}", "");
  // } else {
  //   const signUpInvitationSection = `
  //     <div style="padding: 20px; background-color: #f5f5f5; margin-top: 20px; text-align: center;">
  //       <h2>Finish setting up your free account</h2>
  //       <p>${options.email}</p>
  //       <a href="https://absfhc.com/signup" class="button">Signup for Free</a>
  //     </div>
  //   `;
  //   htmlContent = htmlContent.replace(
  //     "{{signUpInvitationSection}}",
  //     signUpInvitationSection
  //   );
  // }

  const mailOptions = {
    from: "info@alleviacare.com",
    to: options.email,
    subject: `"${options.sender}" sent you an attachment`,
    html: `<!DOCTYPE html>
<html>
<body>
    <div class="container">
        <div class="header">
            <h1>Archi Esign</h1>
        </div>
        <div class="content">
            <p><strong>${options.sender}</strong> has shared Back a document with you</p>
            <a href="https://absfhc.com/file/view/${options.fileId}">VIEW DOCUMENT</a>
        </div>
        <div class="footer">
            <p>The better way to get real estate deals done</p>
            <p>
                Millions of real estate professionals and clients trust our service to get deals done. We reduce complexity and increase security by replacing form creation, e-sign, and transaction management systems with a single end-to-end solution, while helping real estate professionals streamline their business with real-time visibility into their transactions.
            </p>
            <p>
                700 Pete Rose Way, 4th floor,<br>
                Cincinnati, OH 45203<br>
                Have questions? Call us at <a href="tel:+18883685667">+1000000000000 (Archi Esign)</a>
            </p>
        </div>
    </div>
</body>
</html>`,
    attachments: [
      {
        filename: options.fileName,
        path: options.filePath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
