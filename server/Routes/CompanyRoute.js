import express from "express";
import {
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import upload from "../Config/Multer.js";
import {
  archiveCompany,
  createCompany,
  getUserCompanies,
  updateCompanyType,
} from "../Controllers/CompanyController.js";

const Router = express.Router();

// Route to create a new company
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Uses `upload.single("companyPic")` middleware to handle file uploads for the company picture
// - Calls the `createCompany` controller function to handle the request
Router.post(
  "/company/add/new",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  upload.single("companyPic"),
  createCompany
);

// Route to get companies of a user
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Calls the `getUserCompanies` controller function to handle the request
Router.get("/user/companies", isAuthenticatedUser, getUserCompanies);

// Route to update the type of a company
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Calls the `updateCompanyType` controller function to handle the request
Router.put(
  "/company/type/update/:companyId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  updateCompanyType
);

// Route to archive a company
// - Uses `isAuthenticatedUser` middleware to ensure the user is authenticated
// - Uses `authorizeVerifiedUser` middleware to ensure the user is verified
// - Calls the `archiveCompany` controller function to handle the request
Router.put(
  "/company/archive/:companyId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  archiveCompany
);

export default Router;
