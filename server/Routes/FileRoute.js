import express from "express";
import {
  auhtorizeRoles,
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import upload from "../Config/Multer.js";
import {
  getSingleFile,
  getSingleFileDetails,
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

export default Router;
