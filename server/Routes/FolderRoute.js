import express from "express";
import {
  auhtorizeRoles,
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import {
  archiveFolder,
  createFolder,
  getFoldersByCompany,
  getSingleFolder,
  updateFolderType,
} from "../Controllers/FolderController.js";
import upload from "../Config/Multer.js";

const Router = express.Router();

// Route to create a new folder for a company
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Uses `upload.single("folderPic")` middleware to handle file upload with the field name "folderPic"
// - Calls the `createFolder` controller function to handle the request
Router.post(
  "/folder/add/:companyId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  upload.single("folderPic"),
  createFolder
);

// Route to get all folders for a company
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Calls the `getFoldersByCompany` controller function to handle the request
Router.get(
  "/company/folders/:companyId",
  isAuthenticatedUser,
  getFoldersByCompany
);

// Route to get a single folder by its ID
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Calls the `getSingleFolder` controller function to handle the request
Router.get(
  "/user/folder/single/:folderId",
  isAuthenticatedUser,
  getSingleFolder
);

// Route to update the type of a folder
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Calls the `updateFolderType` controller function to handle the request
Router.put(
  "/folder/type/update/:folderId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  updateFolderType
);

// Route to archive a folder
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Calls the `archiveFolder` controller function to handle the request
Router.put(
  "/folder/archive/:folderId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  archiveFolder
);

export default Router;
