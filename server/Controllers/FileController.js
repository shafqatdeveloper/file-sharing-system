import FileUpload from "../Schemas/FileSchema.js";
import Folder from "../Schemas/FolderSchema.js";
import path from "path";

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
    const filePath = path.resolve(file.filePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.status(200).sendFile(filePath);
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
