import express from "express";
import upload from "../Config/Multer.js";
import {
  AddUserAndFolder,
  loggedInUser,
  loginUser,
  logout,
  registerUser,
} from "../Controllers/UserController.js";
import {
  auhtorizeRoles,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
const Router = express.Router();

Router.post("/admin/register", upload.single("profilePic"), registerUser);
Router.post(
  "/admin/add/user",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  upload.single("profilePic"),
  AddUserAndFolder
);
Router.post("/user/login", loginUser);
Router.get("/user/authenticate", isAuthenticatedUser, loggedInUser);
Router.get("/admin/logout", logout);

export default Router;
