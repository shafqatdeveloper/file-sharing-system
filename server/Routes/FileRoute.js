import express from "express";
import {
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import upload from "../Config/Multer.js";
import {
  getSingleFile,
  getSingleFileDetails,
  shareFileByReceiver,
  shareMultipleFiles,
  shareSingleFile,
  uploadFile,
} from "../Controllers/FileController.js";

const Router = express.Router();

// Route to upload a file to a specific folder
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Uses `upload.single("uploadingFile")` middleware to handle file upload with the field name "uploadingFile"
// - Calls the `uploadFile` controller function to handle the request
Router.post(
  "/user/document/upload/:folderId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  upload.single("uploadingFile"),
  uploadFile
);

// Route to get a single file by its ID
// - Calls the `getSingleFile` controller function to handle the request
Router.get("/file/single/:fileId", getSingleFile);

// Route to get the details of a single file by its ID
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Calls the `getSingleFileDetails` controller function to handle the request
Router.get(
  "/file/single/details/:fileId",
  isAuthenticatedUser,
  getSingleFileDetails
);

// Route to share multiple files
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Calls the `shareMultipleFiles` controller function to handle the request
Router.post(
  "/file/share/multiple",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  shareMultipleFiles
);

// Route to share a single file
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Calls the `shareSingleFile` controller function to handle the request
Router.post(
  "/file/share/single",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  shareSingleFile
);

// Route for a receiver to share a file
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Calls the `shareFileByReceiver` controller function to handle the request
Router.post(
  "/file/share/by-receiver",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  shareFileByReceiver
);

export default Router;
