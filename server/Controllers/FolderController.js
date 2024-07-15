import Company from "../Schemas/COmpanySchema.js";
import Folder from "../Schemas/FolderSchema.js";

export const createFolder = async (req, res) => {
  const { folderName } = req.body;
  const folderPic = req.file;
  const { companyId } = req.params;
  try {
    const folderExists = await Folder.findOne({ folderName });
    const parentCompany = await Company.findById(companyId);
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
        parentCompany: companyId,
      });
      parentCompany.folders.push(createdFolder._id);
      await parentCompany.save();
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

export const getFoldersByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const folders = await Folder.find({ parentCompany: companyId });
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
