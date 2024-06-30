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
        folderPic: folderPic.path,
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
