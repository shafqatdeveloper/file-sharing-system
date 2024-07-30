import express from "express";
import {
  authorizeVerifiedUser,
  isAuthenticatedUser,
} from "../Utils/Middlewares/AuthMiddleware.js";
import upload from "../Config/Multer.js";
import {
  createCompany,
  getUserCompanies,
  updateCompanyType,
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

// Update Company Type

Router.put(
  "/company/type/update/:companyId",
  isAuthenticatedUser,
  authorizeVerifiedUser(),
  updateCompanyType
);

export default Router;
