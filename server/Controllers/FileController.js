import FileUpload from "../Schemas/FileSchema.js";
import Folder from "../Schemas/FolderSchema.js";

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
        message: "File Uplaoded",
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
