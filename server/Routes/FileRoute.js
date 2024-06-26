import express from "express";
import {
  auhtorizeRoles,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import upload from "../Config/Multer.js";
import { uploadFile } from "../Controllers/FileController.js";
import { getAllFiles, getSingleFile } from "../Controllers/PdfController.js";
const Router = express.Router();

Router.post(
  "/admin/document/upload/:folderId",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  upload.single("uploadingFile"),
  uploadFile
);

Router.get("/files/all/:folderId", getAllFiles);
Router.get("/file/single/:fileId", getSingleFile);

export default Router;
