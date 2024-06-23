import express from "express";
import path from "path";
import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import upload from "../Config/Multer.js";
import {
  getAllFiles,
  getSingleFile,
  shareFile,
} from "../Controllers/FileController.js";
import pdfFileUpload from "../Config/PdfFileUpload.js";
import {
  convertToPdf,
  uploadFileByAdmin,
} from "../Controllers/ConvertController.js";
import FileUpload from "../Schemas/FileSchema.js";
const Router = express.Router();

Router.post(
  "/upload/document",
  pdfFileUpload.single("uploadedFile"),
  uploadFileByAdmin
);

Router.post("/file/convert", upload.single("receivedFile"), convertToPdf);
Router.get("/files/all/:folderId", getAllFiles);
Router.get("/file/single/:fileId", getSingleFile);
Router.post("/file/share/:fileId", shareFile);

Router.put("/upload/sign", async (req, res) => {
  try {
    const { fileId, signer, signature } = req.body;
    const __dirname = path.resolve();
    const file = await FileUpload.findById(fileId);
    console.log("File Name", file.fileName);
    const realtivePath = file.fileName.split("uploads")[1];
    const deletePath = path.join(__dirname, "public", "uploads", realtivePath);
    console.log("Delete Path", deletePath);
    if (file.sellerSigned && signer === "seller") {
      res.status(401).json({
        success: false,
        message: "Seller has already signed this document",
      });
    } else if (file.buyerSigned && signer === "buyer") {
      res.status(401).json({
        success: false,
        message: "Buyer has already signed this document",
      });
    } else {
      const fileName = `modified_${Date.now()}-convertedFile.pdf`;
      const filePath = path.join(__dirname, "public", "uploads", fileName);
      if (!fs.existsSync(file.fileName)) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }

      const fileBuffer = fs.readFileSync(file.fileName);
      const pdfDoc = await PDFDocument.load(fileBuffer);

      // Decode the signature from base64
      const signatureData = signature.replace(/^data:image\/png;base64,/, "");
      const signatureBytes = Buffer.from(signatureData, "base64");
      const signatureImage = await pdfDoc.embedPng(signatureBytes);

      const pages = pdfDoc.getPages();
      const signaturePage = pages[pages.length - 1];
      const { height } = signaturePage.getSize();

      // Adjust the coordinates and size as needed
      const xPosition = 150; // Example coordinates for buyer and seller
      const yPosition = signer === "buyer" ? 285 : 220;
      const width = 100;
      const heightSignature = 50;

      signaturePage.drawImage(signatureImage, {
        x: xPosition,
        y: yPosition,
        width: width,
        height: heightSignature,
      });

      const modifiedPdfBytes = await pdfDoc.save();
      fs.writeFileSync(filePath, modifiedPdfBytes);
      if (signer === "seller") {
        file.sellerSigned = true;
        await file.save();
      } else if (signer === "buyer") {
        file.buyerSigned = true;
        await file.save();
      }
      file.fileName = filePath;
      fs.unlinkSync(deletePath);
      await file.save();
      res.status(200).json({
        success: true,
        message: "Signature added and saved",
        filePath: file.fileName,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
});

export default Router;
