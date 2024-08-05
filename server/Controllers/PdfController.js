import FileUpload from "../Schemas/FileSchema.js";
import Folder from "../Schemas/FolderSchema.js";
import { promises as fs } from "fs";

// Function to get all files in a folder by its ID
export const getAllFiles = async (req, res) => {
  try {
    const { folderId } = req.params; // Get the folder ID from the request parameters

    // Find the folder by its ID and populate its files
    const folder = await Folder.findById(folderId).populate("files");
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Read the content of each file and convert it to a base64 string
    const fileBuffers = await Promise.all(
      folder.files.map(async (file) => {
        const fileContent = await fs.readFile(file.filePath);
        return {
          ...file.toObject(), // Convert the file document to a plain JavaScript object
          buffer: fileContent.toString("base64"), // Convert buffer to base64 string
        };
      })
    );

    // Respond with the folder and its files
    res.status(200).json({
      success: true,
      files: folder,
      pdfFiles: fileBuffers,
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to get a single file by its ID
export const getSingleFile = async (req, res) => {
  try {
    const { fileId } = req.params; // Get the file ID from the request parameters

    // Find the file by its ID
    const file = await FileUpload.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Read the content of the file and convert it to a base64 string
    const fileContent = await fs.readFile(file.filePath);
    const fileBuffer = {
      ...file.toObject(), // Convert the file document to a plain JavaScript object
      buffer: fileContent.toString("base64"), // Convert buffer to base64 string
    };

    // Respond with the file details
    res.status(200).json({
      success: true,
      file: fileBuffer,
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
