import FileUpload from "../Schemas/FileSchema.js";
import Folder from "../Schemas/FolderSchema.js";
import path from "path";
import fs from "fs";
import { EmailPDFFIle } from "../Utils/Middlewares/ShareFiles/EmailFile.js";
import User from "../Schemas/UserSchema.js";

export const uploadFile = async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder) {
      res.status(401).json({
        success: false,
        message: `Folder not exist`,
      });
    } else {
      const uploadingFile = req.file;
      console.log(uploadingFile);
      const createdFile = await FileUpload.create({
        fileName: uploadingFile.filename,
        Name: uploadingFile.originalname,
        filePath: uploadingFile.path,
        folder: folderId,
        uplaodedBy: req.user,
      });
      folder.files.push(createdFile._id);
      await folder.save();
      res.status(200).json({
        success: true,
        message: "File Uploaded",
      });
    }
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
    const file = await FileUpload.findById(fileId);
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "public", "uploads", file.fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Set the content type and other headers
    res.setHeader("Content-Type", "application/pdf");

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      res.status(500).json({
        success: false,
        message: `Server Error: ${error.message}`,
      });
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
export const getSingleFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await FileUpload.findById(fileId);
    res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const shareMultipleFiles = async (req, res) => {
  try {
    const { sharingFiles, folderId, shareSetting, email } = req.body; // Assume fileIds is an array of IDs received from the frontend
    const files = await FileUpload.find({ _id: { $in: sharingFiles } });

    if (!files.length) {
      return res.status(404).json({
        success: false,
        message: "Files not Found",
      });
    }
    const folder = await Folder.findById(folderId);
    const fileLinks = files.map(
      (file) =>
        `${req.protocol}://${req.get("host")}/public/uploads/${file.fileName}`
    );
    const loggedInUser = await User.findById(req.user);
    const options = {
      email,
      fileLinks,
      sender: loggedInUser.name,
      folderName: folder.folderName,
      folderId,
    };

    await EmailPDFFIle(options);

    res.status(200).json({
      success: true,
      message: "Files Sent Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
