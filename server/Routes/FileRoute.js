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

Router.post(
  "/user/document/upload/:folderId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  upload.single("uploadingFile"),
  uploadFile
);

Router.get("/file/single/:fileId", getSingleFile);
Router.get(
  "/file/single/details/:fileId",
  isAuthenticatedUser,
  getSingleFileDetails
);
Router.post(
  "/file/share/multiple",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  shareMultipleFiles
);
Router.post(
  "/file/share/single",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  shareSingleFile
);
Router.post(
  "/file/share/by-receiver",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  shareFileByReceiver
);

export default Router;
