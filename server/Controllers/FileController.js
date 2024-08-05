import FileUpload from "../Schemas/FileSchema.js";
import Folder from "../Schemas/FolderSchema.js";
import path from "path";
import fs from "fs";
import {
  EmailMultiplePDFFIle,
  EmailPDFFIleByReceiver,
  EmailSinglePDFFIle,
} from "../Utils/Middlewares/ShareFiles/EmailFile.js";
import User from "../Schemas/UserSchema.js";

// Function to upload a file to a folder
export const uploadFile = async (req, res) => {
  try {
    const { folderId } = req.params; // Get the folder ID from the request parameters
    const folder = await Folder.findById(folderId); // Find the folder by its ID

    // Check if the folder exists
    if (!folder) {
      return res.status(401).json({
        success: false,
        message: `Folder not exist`,
      });
    }

    const uploadingFile = req.file; // Get the uploaded file from the request

    // Create a new file record in the database
    const createdFile = await FileUpload.create({
      fileName: uploadingFile.filename,
      Name: uploadingFile.originalname,
      filePath: uploadingFile.path,
      folder: folderId,
      uploadedBy: req.user, // Assuming req.user contains the ID of the logged-in user
    });

    // Add the file to the folder's files array and save the folder
    folder.files.push(createdFile._id);
    await folder.save();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "File Uploaded",
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to get a single file by its ID and stream it to the response
export const getSingleFile = async (req, res) => {
  try {
    const { fileId } = req.params; // Get the file ID from the request parameters
    const file = await FileUpload.findById(fileId); // Find the file by its ID
    const __dirname = path.resolve(); // Resolve the current directory path
    const filePath = path.join(__dirname, "public", "uploads", file.fileName); // Construct the file path

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Set the content type and other headers for the response
    res.setHeader("Content-Type", "application/pdf");

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Handle any errors during the file streaming
    fileStream.on("error", (error) => {
      res.status(500).json({
        success: false,
        message: `Server Error: ${error.message}`,
      });
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to get details of a single file by its ID
export const getSingleFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params; // Get the file ID from the request parameters
    const file = await FileUpload.findById(fileId); // Find the file by its ID

    // Respond with the file details
    res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to share multiple files via email
export const shareMultipleFiles = async (req, res) => {
  try {
    const { sharingFiles, folderId, shareSetting, email } = req.body; // Get sharing details from the request body
    const files = await FileUpload.find({ _id: { $in: sharingFiles } }); // Find the files by their IDs

    // Check if files exist
    if (!files.length) {
      return res.status(404).json({
        success: false,
        message: "Files not Found",
      });
    }

    const folder = await Folder.findById(folderId); // Find the folder by its ID
    const fileLinks = files.map((file) => {
      const fileName = encodeURIComponent(file.fileName);
      return `${req.protocol}://absfhc.com/uploads/${fileName}`; // Generate links to the files
    });
    const filePaths = files.map((file) => file.filePath); // Get file paths
    const loggedInUser = await User.findById(req.user); // Get the logged-in user details
    const singleFileLinks = files.map(
      (file) =>
        `${req.protocol}://absfhc.com/file/view/receiver/${file._id}?sender=${loggedInUser._id}`
    );
    const isReceiverMember = await User.findOne({ email }); // Check if the receiver is a registered user
    const options = {
      email,
      fileLinks,
      receiverMember: isReceiverMember ? true : false,
      editable: shareSetting.editable,
      linkOnly: shareSetting.shareLink,
      fileOnly: shareSetting.shareFile,
      sender: loggedInUser.fName,
      folderName: folder.folderName,
      folderId,
      filePaths,
      singleFileLinks,
    };

    // Send the email with the files
    await EmailMultiplePDFFIle(options);

    // Mark the files as shared
    await FileUpload.updateMany(
      { _id: { $in: sharingFiles } },
      { $set: { shared: true } }
    );

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Files Sent Successfully",
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

// Function to share a single file via email
export const shareSingleFile = async (req, res) => {
  try {
    const { sharingFile, folderId, shareSetting, email } = req.body; // Get sharing details from the request body
    const file = await FileUpload.findById(sharingFile); // Find the file by its ID

    // Check if the file exists
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not Found",
      });
    }

    const loggedInUser = await User.findById(req.user); // Get the logged-in user details
    const isReceiverMember = await User.findOne({ email }); // Check if the receiver is a registered user
    const options = {
      email,
      sender: loggedInUser.fName,
      receiverMember: isReceiverMember ? true : false,
      editable: shareSetting.editable,
      linkOnly: shareSetting.shareLink,
      fileOnly: shareSetting.shareFile,
      fileId: sharingFile,
      fileName: file.Name,
      filePath: file.filePath,
      senderId: loggedInUser._id,
    };

    // Send the email with the file
    await EmailSinglePDFFIle(options);

    // Mark the file as shared
    file.shared = true;
    await file.save();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "File Sent Successfully",
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to share a file by the receiver via email
export const shareFileByReceiver = async (req, res) => {
  try {
    const { fileId, email, sendingBackToSender } = req.body; // Get sharing details from the request body
    const file = await FileUpload.findById(fileId); // Find the file by its ID

    // Check if the file exists
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not Found",
      });
    }

    const loggedInUser = await User.findById(req.user); // Get the logged-in user details
    const options = {
      email,
      sender: loggedInUser.fName,
      fileId,
      fileName: file.Name,
      filePath: file.filePath,
      sendingBackToSender,
    };

    // Send the email with the file
    await EmailPDFFIleByReceiver(options);

    // Mark the file as shared
    file.shared = true;
    await file.save();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "File Sent Successfully",
    });
  } catch (error) {
    // Catch any errors and respond with an error message
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
};
