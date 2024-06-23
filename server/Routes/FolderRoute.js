import express from "express";
import {
  auhtorizeRoles,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import { getAllFolders, shareFolder } from "../Controllers/FolderController.js";

const Router = express.Router();

Router.get(
  "/admin/folders/all",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  getAllFolders
);
Router.post("/folder/share/:folderId", shareFolder);

export default Router;
