import Folder from "../Schemas/FolderSchema.js";

export const createFolder = async (req, res) => {
  const { folderName } = req.body;
  const folderPic = req.file;
  try {
    const folderExists = await Folder.findOne({ folderName });
    if (folderExists) {
      res.status(401).json({
        success: false,
        message: `Folder already Exists with this Name`,
      });
    } else {
      const createdFolder = await Folder.create({
        folderName,
        folderAdmin: req.user,
        folderPic: folderPic.filename,
      });
      res.status(200).json({
        success: true,
        message: "Folder Created Successfully",
        createdFolder,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const getUserFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ folderAdmin: req.user });
    res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const getSingleFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId).populate("files");
    res.status(200).json({
      success: true,
      folder,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};
