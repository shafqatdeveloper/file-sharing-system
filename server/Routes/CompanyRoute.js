import express from "express";
import {
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import upload from "../Config/Multer.js";
import {
  createCompany,
  getUserCompanies,
} from "../Controllers/CompanyController.js";
const Router = express.Router();

// Create a New Company
Router.post(
  "/company/add/new",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  upload.single("companyPic"),
  createCompany
);
// Get Companies of a User

Router.get("/user/companies", isAuthenticatedUser, getUserCompanies);

export default Router;
