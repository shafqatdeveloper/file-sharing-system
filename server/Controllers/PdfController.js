import FileUpload from "../Schemas/FileSchema.js";
import Folder from "../Schemas/FolderSchema.js";
import { promises as fs } from "fs";

export const getAllFiles = async (req, res) => {
  try {
    const { folderId } = req.params;
    console.log("FolderId", folderId);

    const folder = await Folder.findById(folderId).populate("files");
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    const fileBuffers = await Promise.all(
      folder.files.map(async (file) => {
        const fileContent = await fs.readFile(file.filePath);
        return {
          ...file.toObject(),
          buffer: fileContent.toString("base64"), // Convert buffer to base64 string
        };
      })
    );

    res.status(200).json({
      success: true,
      files: folder,
      pdfFiles: fileBuffers,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const getSingleFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log("File ID", fileId);
    const file = await FileUpload.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const fileContent = await fs.readFile(file.filePath);
    const fileBuffer = {
      ...file.toObject(),
      buffer: fileContent.toString("base64"), // Convert buffer to base64 string
    };

    res.status(200).json({
      success: true,
      file: fileBuffer,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
