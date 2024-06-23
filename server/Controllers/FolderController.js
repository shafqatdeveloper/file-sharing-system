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
