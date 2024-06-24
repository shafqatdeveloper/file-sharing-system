import Folder from "../Schemas/FolderSchema.js";
import { SendFolderLink } from "../Utils/Middlewares/EmailFile.js";

export const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find().populate("admin");
    res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const createFolder = async (req, res) => {
  const { folderName } = req.body;
  try {
    const folderExists = await Folder.findOne({ folderName });
    if (folderExists) {
      res.status(401).json({
        success: false,
        message: `Folder already Exists with this Name`,
      });
    } else {
      await Folder.create({ folderName, admin: req.user });
      res
        .status(200)
        .json({ success: true, message: "Folder Created Successfully" });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const shareFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { receiver } = req.body;
    const options = {
      folderId,
      receiver,
    };
    await SendFolderLink(options);
    await res.status(200).json({
      success: true,
      message: `Folder Link sent to ${receiver}`,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
