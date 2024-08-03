import express from "express";
import upload from "../Config/Multer.js"; // Importing the Multer configuration for file uploads
import {
  addAdmin,
  changePassword,
  inviteFriendToWebsite,
  isNotVerifiedUser,
  loggedInUser,
  loggedInUserDetails,
  loginUser,
  logout,
  registerUser,
  resendVerificationEmail,
  singleUserDetails,
  updateAdminInfo,
  updateUserRole,
  verifyUserEmail,
} from "../Controllers/UserController.js"; // Importing user-related controllers
import {
  auhtorizeRoles,
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js"; // Importing authentication and authorization middlewares

const Router = express.Router(); // Creating an instance of the express router

// Route for user registration
Router.post("/user/register", registerUser);

// Route for verifying user email with a token
Router.put("/user/verify-email/:verificationToken", verifyUserEmail);

// Route for user login
Router.post("/user/login", loginUser);

// Route for authenticating a logged-in user
Router.get("/user/authenticate", isAuthenticatedUser, loggedInUser);

// Route for user logout
Router.get("/user/logout", isAuthenticatedUser, logout);

// Route for adding an admin, requires authentication and admin role, and uploads a profile picture
Router.post(
  "/admin/add",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  upload.single("profilePic"),
  addAdmin
);

// Route for changing admin password, requires authentication and admin role
Router.put(
  "/admin/password/change",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  changePassword
);

// Route for updating admin info, requires authentication and admin role, and uploads a profile picture
Router.put(
  "/admin/update",
  isAuthenticatedUser,
  auhtorizeRoles("admin"),
  upload.single("profilePic"),
  updateAdminInfo
);

// Route for checking if a user is not verified, requires authentication
Router.get("/user/check/verification", isAuthenticatedUser, isNotVerifiedUser);

// Route for resending verification email, requires authentication
Router.get(
  "/user/resend/verification-email",
  isAuthenticatedUser,
  resendVerificationEmail
);

// Route for getting details of a single user by user ID, requires authentication
Router.get(
  "/user/single/details/:userId",
  isAuthenticatedUser,
  singleUserDetails
);

// Route for getting details of a Logged In user, requires authentication

Router.get("/user/me", isAuthenticatedUser, loggedInUserDetails);

// Update User Role
Router.put(
  "/user/role/update/:userId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  updateUserRole
);

// Invite Friend
Router.post(
  "/friend/invite",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  inviteFriendToWebsite
);
export default Router; // Exporting the router as the default export
