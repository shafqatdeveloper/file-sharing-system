import express from "express";
import upload from "../Config/Multer.js";
import {
  addAdmin,
  changePassword,
  loggedInUser,
  loginUser,
  logout,
  registerUser,
  updateAdminInfo,
  verifyUserEmail,
} from "../Controllers/UserController.js";
import {
  auhtorizeRoles,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
const Router = express.Router();

Router.post("/user/register", registerUser);
Router.put("/user/verify-email/:verificationToken", verifyUserEmail);
Router.post("/user/login", loginUser);
Router.get("/user/authenticate", isAuthenticatedUser, loggedInUser);
Router.get("/user/logout", isAuthenticatedUser, logout);
Router.post(
  "/admin/add",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  upload.single("profilePic"),
  addAdmin
);
Router.put(
  "/admin/password/change",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  changePassword
);
Router.put(
  "/admin/update",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  upload.single("profilePic"),
  updateAdminInfo
);

export default Router;
