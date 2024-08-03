import Company from "../Schemas/CompanySchema.js";
import Folder from "../Schemas/FolderSchema.js";

// Create a Folder
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
      createdFolder.accessors.push(req.user);
      parentCompany.folders.push(createdFolder._id);
      await createdFolder.save();
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

// Get Folders by Company Id
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

// Get Single Folder by ID
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

// Update Folder Type
export const updateFolderType = async (req, res) => {
  try {
    const { folderId } = req.params;
    console.log(folderId);
    const { updatedFolderType } = req.body;
    const folder = await Folder.findById(folderId);
    if (!folder) {
      res.status(401).json({
        success: false,
        message: `Folder not Found`,
      });
    } else {
      folder.folderType = updatedFolderType;
      await folder.save();
      res.status(200).json({
        success: true,
        message: "Folder Type Updated",
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};

// Archive Folder
export const archiveFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder) {
      res.status(401).json({
        success: false,
        message: `Folder not Found`,
      });
    } else {
      if (folder.archived) {
        folder.archived = false;
        await folder.save();
        res.status(200).json({
          success: true,
          message: "Folder Unarchived",
        });
      } else {
        folder.archived = true;
        await folder.save();
        res.status(200).json({
          success: true,
          message: "Folder Archived",
        });
      }
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};
