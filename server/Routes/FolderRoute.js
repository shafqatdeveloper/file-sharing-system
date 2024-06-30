import express from "express";
import {
  auhtorizeRoles,
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import {
  createFolder,
  getUserFolders,
} from "../Controllers/FolderController.js";
import upload from "../Config/Multer.js";

const Router = express.Router();

Router.post(
  "/folder/add",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  upload.single("folderPic"),
  createFolder
);
Router.get("/user/folders", isAuthenticatedUser, getUserFolders);
export default Router;
