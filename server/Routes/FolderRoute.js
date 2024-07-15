import express from "express";
import {
  auhtorizeRoles,
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import {
  createFolder,
  getFoldersByCompany,
  getSingleFolder,
} from "../Controllers/FolderController.js";
import upload from "../Config/Multer.js";

const Router = express.Router();

Router.post(
  "/folder/add/:companyId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  upload.single("folderPic"),
  createFolder
);
Router.get(
  "/company/folders/:companyId",
  isAuthenticatedUser,
  getFoldersByCompany
);
Router.get(
  "/user/folder/single/:folderId",
  isAuthenticatedUser,
  getSingleFolder
);
export default Router;
