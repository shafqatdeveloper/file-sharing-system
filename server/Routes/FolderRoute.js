import express from "express";
import {
  auhtorizeRoles,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import {
  createFolder,
  deleteFolder,
  getAllFolders,
  shareFolder,
  updateFolder,
} from "../Controllers/FolderController.js";

const Router = express.Router();

Router.get(
  "/admin/folders/all",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  getAllFolders
);
Router.post("/folder/share/:folderId", shareFolder);
Router.post(
  "/admin/folder/add",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  createFolder
);

Router.put(
  "/admin/folder/update/:folderId",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  updateFolder
);

Router.delete(
  "/admin/folder/delete/:folderId",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  deleteFolder
);

export default Router;
