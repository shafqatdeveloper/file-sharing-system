import FileUpload from "../Schemas/FileSchema.js";
import Folder from "../Schemas/FolderSchema.js";
import path from "path";
import fs from "fs";
import {
  EmailMultiplePDFFIle,
  EmailSinglePDFFIle,
} from "../Utils/Middlewares/ShareFiles/EmailFile.js";
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
    const { sharingFiles, folderId, shareSetting, email } = req.body;
    const files = await FileUpload.find({ _id: { $in: sharingFiles } });

    if (!files.length) {
      return res.status(404).json({
        success: false,
        message: "Files not Found",
      });
    }
    const folder = await Folder.findById(folderId);
    const fileLinks = files.map((file) => {
      const fileName = encodeURIComponent(file.fileName);
      return `${req.protocol}://absfhc.com/uploads/${fileName}`;
    });
    const filePaths = files.map((file) => {
      return file.filePath;
    });
    const loggedInUser = await User.findById(req.user);
    const options = {
      email,
      fileLinks,
      sender: loggedInUser.fName,
      folderName: folder.folderName,
      folderId,
      filePaths,
    };

    await EmailMultiplePDFFIle(options);
    await FileUpload.updateMany(
      { _id: { $in: sharingFiles } },
      { $set: { shared: true } }
    );

    res.status(200).json({
      success: true,
      message: "Files Sent Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ` ${error.message}`,
    });
  }
};

export const shareSingleFile = async (req, res) => {
  try {
    const { sharingFile, folderId, shareSetting, email } = req.body;
    const file = await FileUpload.findById(sharingFile);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not Found",
      });
    }
    const folder = await Folder.findById(folderId);
    const loggedInUser = await User.findById(req.user);
    const options = {
      email,
      sender: loggedInUser.fName,
      folderName: folder.folderName,
      fileId: sharingFile,
      fileName: file.Name,
      filePath: file.filePath,
    };
    await EmailSinglePDFFIle(options);
    file.shared = true;
    await file.save();
    res.status(200).json({
      success: true,
      message: "File Sent Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
