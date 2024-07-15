import Company from "../Schemas/CompanySchema.js";
import User from "../Schemas/UserSchema.js";

// Create a New Company

export const createCompany = async (req, res) => {
  try {
    const { companyName, companyType } = req.body;
    const companyPic = req.file;
    const admin = await User.findById(req.user);
    if (!admin) {
      res.status(401).json({
        success: false,
        message: "User not Exist",
      });
    } else {
      const companyExists = await Company.findOne({ companyName });
      if (companyExists) {
        res.status(401).json({
          success: false,
          message: "Company Already Exists with this Name",
        });
      } else {
        const createdCompany = await Company.create({
          companyName,
          companyPic: companyPic.filename,
          companyType,
          companyAdmin: admin,
        });
        res.status(201).json({
          success: true,
          message: "Company Added Successfully",
          createdCompany,
        });
      }
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Comapnies of a User

export const getUserCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ companyAdmin: req.user });
    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};
