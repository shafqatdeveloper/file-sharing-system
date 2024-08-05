import mongoose from "mongoose";
import Company from "../Schemas/CompanySchema.js";
import Team from "../Schemas/TeamSchema.js";
import User from "../Schemas/UserSchema.js";

// Function to create a new company
export const createCompany = async (req, res) => {
  try {
    // Destructure company details from the request body
    const { companyName, companyType } = req.body;
    const companyPic = req.file; // Assuming file upload for company picture

    // Find the admin user based on the user ID present in the request
    const admin = await User.findById(req.user).populate("teams");

    // Check if the admin user exists
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "User not Exist",
      });
    }

    // Check if a company with the same name already exists
    const companyExists = await Company.findOne({ companyName });
    if (companyExists) {
      return res.status(401).json({
        success: false,
        message: "Company Already Exists with this Name",
      });
    }

    // Initialize a set to collect unique team members
    let teamMembers = new Set();

    // Iterate over each team the admin is part of
    for (const teamId of admin.teams) {
      // Find the team by its ID and populate the teamMembers field
      const team = await Team.findById(teamId).populate("teamMembers");

      // Check if the team exists and the admin is the team leader
      if (team && team.teamLeader.equals(admin._id) && team.teamMembers) {
        // Add each team member's ID to the set
        team.teamMembers.forEach((member) =>
          teamMembers.add(member._id.toString())
        );
      }
    }

    // Add the admin's ID to the set of team members
    teamMembers.add(admin._id.toString());

    // Convert the set of team members' IDs to an array of ObjectId instances
    const accessorsArray = Array.from(teamMembers).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Create a new company with the provided details and the collected accessors
    const createdCompany = await Company.create({
      companyName,
      companyPic: companyPic.filename,
      companyType,
      companyAdmin: admin,
      accessors: accessorsArray,
    });

    // Send a success response with the created company details
    res.status(201).json({
      success: true,
      message: "Company Added Successfully",
      createdCompany,
    });
  } catch (error) {
    // Catch any errors and send a failure response with the error message
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to get companies associated with a user and their team
export const getUserCompanies = async (req, res) => {
  try {
    // Find companies where the user is listed as an accessor and populate the companyAdmin field
    const companies = await Company.find({ accessors: req.user }).populate(
      "companyAdmin"
    );

    // Respond with the found companies
    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    // Catch any errors and send a failure response with the error message
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to archive or unarchive a company
export const archiveCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Find the company by its ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Company Not Found",
      });
    }

    // Toggle the archived status of the company
    company.archived = !company.archived;
    await company.save();

    // Respond with the appropriate message based on the new archived status
    res.status(200).json({
      success: true,
      message: company.archived ? "Archived" : "Unarchived",
    });
  } catch (error) {
    // Catch any errors and send a failure response with the error message
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to update the company type
export const updateCompanyType = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { updatedCompanyType } = req.body;

    // Find the company by its ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Company Not Found",
      });
    }

    // Update the company type and save the company
    company.companyType = updatedCompanyType;
    await company.save();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Company Type Updated",
    });
  } catch (error) {
    // Catch any errors and send a failure response with the error message
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};
