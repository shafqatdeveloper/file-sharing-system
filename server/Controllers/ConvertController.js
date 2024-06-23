import FileUpload from "../Schemas/FileSchema.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import mammoth from "mammoth";
import htmlPdf from "html-pdf-node";
import path from "path";
import Folder from "../Schemas/FolderSchema.js";

export const convertToPdf = async (req, res) => {
  try {
    const originalName = req.file.originalname;
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileType = path.extname(originalName).toLowerCase();
    let pdfBytes;

    if (fileType === ".docx") {
      const result = await mammoth.convertToHtml({ buffer: fileBuffer });
      const html = result.value;
      const pdfBuffer = await htmlPdf.generatePdf(
        { content: html },
        { format: "A4" }
      );
      pdfBytes = pdfBuffer;
    } else if (fileType === ".pdf") {
      pdfBytes = fileBuffer;
    } else if (
      fileType === ".jpg" ||
      fileType === ".jpeg" ||
      fileType === ".png"
    ) {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      let image;
      if (fileType === ".jpg" || fileType === ".jpeg") {
        image = await pdfDoc.embedJpg(fileBuffer);
      } else if (fileType === ".png") {
        image = await pdfDoc.embedPng(fileBuffer);
      }
      const { width, height } = image.scale(1);
      page.setSize(width, height);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
      pdfBytes = await pdfDoc.save();
    } else {
      throw new Error("Unsupported file type");
    }

    // Remove the original file after processing
    // fs.unlinkSync(req.file.path);

    // Set the response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="converted_${path
        .basename(originalName, fileType)
        .replace(/-/g, "_")}.pdf"`
    );

    // Send the PDF file as a buffer
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error during file conversion:", error);
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadFileByAdmin = async (req, res) => {
  try {
    const { folderId } = req.body;
    const folder = await Folder.findById(folderId);
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const page = pdfDoc.addPage([600, 400]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 18;

    page.drawText("Digital Signature", {
      x: 50,
      y: height - 50,
      size: fontSize,
      font,
    });
    page.drawText("Buyer:", { x: 50, y: height - 100, size: fontSize, font });
    page.drawText("Seller:", { x: 50, y: height - 150, size: fontSize, font });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const __dirname = path.resolve();
    const newFilePath = path.join(
      __dirname,
      "public",
      "uploads",
      `modified_${path.basename(filePath)}`
    );
    const createdFile = await FileUpload.create({
      fileName: newFilePath,
      folder: folder._id,
    });

    // Delete Old File
    const deletePath = path.join(__dirname, "public", "uploads", filePath);
    // fs.unlinkSync(deletePath);
    // console.log(deletePath);
    // Write the modified PDF to the new file path
    fs.writeFileSync(newFilePath, pdfBytes);
    folder.files.push(createdFile._id);
    await folder.save();
    res.status(200).json({
      success: true,
      message: "Uploaded and saved",
      filePath: newFilePath,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};
