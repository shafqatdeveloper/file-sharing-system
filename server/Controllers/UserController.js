import Folder from "../Schemas/FolderSchema.js";
import User from "../Schemas/UserSchema.js";
import crypto from "crypto";
import { sendEmailVerificationToken } from "../Utils/Middlewares/Verification.js";

// Register a User
const generateVerficationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const registerUser = async (req, res) => {
  const {
    fName,
    lName,
    username,
    phoneNumber,
    companyName,
    aboutCompany,
    email,
    password,
  } = req.body;
  console.log(email);
  try {
    const userExistByEmail = await User.findOne({ email });
    if (userExistByEmail) {
      res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    } else {
      const userExistByUsername = await User.findOne({ username });
      if (userExistByUsername) {
        res.status(401).json({
          success: false,
          message: "User Already Exists",
        });
      } else {
        const verificationToken = generateVerficationToken();
        const NewUser = await User.create({
          fName,
          lName,
          username,
          phoneNumber,
          companyName,
          aboutCompany,
          email,
          password,
          verificationToken,
        });
        const token = NewUser.JWTTOKEN();
        const options = { email, verificationToken };
        await sendEmailVerificationToken(options);
        res
          .status(200)
          .cookie("token", token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          })
          .json({
            success: true,
            message: "User Registered, Check your Email to Verify!",
            NewUser,
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

// Verify a User
export const verifyUserEmail = async (req, res) => {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOne({ verificationToken });
    if (!user) {
      res.status(401).json({
        success: false,
        message: `Verification token is expired or invalid`,
      });
    } else {
      user.verifiedUser = true;
      user.verificationToken = undefined;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Email Verified Successfully",
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Resend Verification Email

export const resendVerificationEmail = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user);
    if (loggedInUser.verifiedUser) {
      res.status(401).json({
        success: false,
        message: `User Email is already Verified`,
      });
    } else {
      loggedInUser.verificationToken = undefined;
      await loggedInUser.save();
      const verificationToken = generateVerficationToken();
      const options = { email: loggedInUser.email, verificationToken };
      await sendEmailVerificationToken(options);
      loggedInUser.verificationToken = verificationToken;
      await loggedInUser.save();
      res.status(200).json({
        success: true,
        message: "Verification Email Sent!",
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Check if User is not Verified
export const isNotVerifiedUser = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user);
    if (!loggedInUser.verifiedUser) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "User Verified",
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};

// Login User

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(401).json({
        success: false,
        message: "Both Email and Password are compulsory",
      });
    } else {
      const loggingInUser = await User.findOne({ email });
      if (!loggingInUser) {
        res.status(403).json({
          success: false,
          message: "Invalid Email or Password",
        });
      } else {
        const isPasswordMatched = await loggingInUser.comparePassword(password);
        if (!isPasswordMatched) {
          res.status(404).json({
            success: false,
            message: "Invalid Email or Password",
          });
        } else {
          const token = loggingInUser.JWTTOKEN();
          res
            .status(200)
            .cookie("token", token, {
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            })
            .json({
              success: true,
              message: "Logged In Successfully",
              loggedInUser: loggingInUser,
            });
        }
      }
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Authenticate User

export const loggedInUser = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user);
    if (!loggedInUser) {
      res.status(402).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        loggedInUser,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Logout
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged Out",
      });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Add Admin

export const addAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const profilePic = req.file;
  try {
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      res.status(401).json({
        success: false,
        message: "Admin Already Exists",
      });
    } else {
      const NewUser = await User.create({
        name,
        email,
        password,
        userProfilePic: profilePic.filename,
      });
      res.status(200).json({
        success: true,
        message: "Admin Added",
        NewUser,
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// Change Passwor Admin

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const loggedInAdmin = await User.findById(req.user);
    if (!loggedInAdmin) {
      res.status(401).json({
        success: false,
        message: `Not Authorized`,
      });
    } else {
      const passwordMatched = await loggedInAdmin.comparePassword(oldPassword);
      if (!passwordMatched) {
        res.status(401).json({
          success: false,
          message: `Old Password not Matched`,
        });
      } else {
        loggedInAdmin.password = newPassword;
        await loggedInAdmin.save();
        res.status(200).json({
          success: true,
          message: "Password Updated",
        });
      }
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Update Admin Info

export const updateAdminInfo = async (req, res) => {
  const { name, email, password } = req.body;
  const profilePic = req.file;
  try {
    const loggedInAdmin = await User.findById(req.user);
    if (!loggedInAdmin) {
      res.status(401).json({
        success: false,
        message: `Not Authorized`,
      });
    } else {
      const passwordMatched = await loggedInAdmin.comparePassword(password);
      if (!passwordMatched) {
        res.status(401).json({
          success: false,
          message: `Password not Matched`,
        });
      } else {
        await User.findByIdAndUpdate(req.user, { name, email, profilePic });
        res.status(200).json({
          success: true,
          message: "Admin info Updated",
        });
      }
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
