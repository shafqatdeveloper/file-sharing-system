import express from "express";
import {
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import upload from "../Config/Multer.js";
import {
  getSingleFile,
  getSingleFileDetails,
  shareMultipleFiles,
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
  "/file/share/:fileId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  shareMultipleFiles
);

export default Router;
