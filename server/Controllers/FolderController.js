import Company from "../Schemas/CompanySchema.js";
import Folder from "../Schemas/FolderSchema.js";

// Function to create a new folder
export const createFolder = async (req, res) => {
  const { folderName } = req.body; // Get the folder name from the request body
  const folderPic = req.file; // Get the uploaded folder picture from the request
  const { companyId } = req.params; // Get the company ID from the request parameters

  try {
    // Check if a folder with the same name already exists
    const folderExists = await Folder.findOne({ folderName });

    // Find the parent company by its ID
    const parentCompany = await Company.findById(companyId);

    // If the folder already exists, respond with an error message
    if (folderExists) {
      return res.status(401).json({
        success: false,
        message: "Folder already Exists with this Name",
      });
    }

    // Create a new folder
    const createdFolder = await Folder.create({
      folderName,
      folderAdmin: req.user, // Assuming req.user contains the ID of the logged-in user
      folderPic: folderPic.filename,
      parentCompany: companyId,
    });

    // Add the logged-in user as an accessor to the folder
    createdFolder.accessors.push(req.user);

    // Add the folder to the parent company's folders array and save both
    parentCompany.folders.push(createdFolder._id);
    await createdFolder.save();
    await parentCompany.save();

    // Respond with a success message and the created folder details
    res.status(200).json({
      success: true,
      message: "Folder Created Successfully",
      createdFolder,
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to get all folders by company ID
export const getFoldersByCompany = async (req, res) => {
  try {
    const { companyId } = req.params; // Get the company ID from the request parameters

    // Find all folders that belong to the specified company
    const folders = await Folder.find({ parentCompany: companyId });

    // Respond with the found folders
    res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to get a single folder by its ID
export const getSingleFolder = async (req, res) => {
  try {
    const { folderId } = req.params; // Get the folder ID from the request parameters

    // Find the folder by its ID and populate its files
    const folder = await Folder.findById(folderId).populate("files");

    // Respond with the folder details
    res.status(200).json({
      success: true,
      folder,
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};

// Function to update the type of a folder
export const updateFolderType = async (req, res) => {
  try {
    const { folderId } = req.params; // Get the folder ID from the request parameters
    const { updatedFolderType } = req.body; // Get the updated folder type from the request body

    // Find the folder by its ID
    const folder = await Folder.findById(folderId);

    // If the folder is not found, respond with an error message
    if (!folder) {
      return res.status(401).json({
        success: false,
        message: "Folder not Found",
      });
    }

    // Update the folder type and save the folder
    folder.folderType = updatedFolderType;
    await folder.save();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Folder Type Updated",
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};

// Function to archive or unarchive a folder
export const archiveFolder = async (req, res) => {
  try {
    const { folderId } = req.params; // Get the folder ID from the request parameters

    // Find the folder by its ID
    const folder = await Folder.findById(folderId);

    // If the folder is not found, respond with an error message
    if (!folder) {
      return res.status(401).json({
        success: false,
        message: "Folder not Found",
      });
    }

    // Toggle the archived status of the folder
    folder.archived = !folder.archived;
    await folder.save();

    // Respond with the appropriate message based on the new archived status
    res.status(200).json({
      success: true,
      message: folder.archived ? "Folder Archived" : "Folder Unarchived",
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};
