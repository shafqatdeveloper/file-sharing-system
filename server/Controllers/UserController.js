import User from "../Schemas/UserSchema.js";
import crypto from "crypto";
import { sendEmailVerificationToken } from "../Utils/Middlewares/Verification.js";
import Team from "../Schemas/TeamSchema.js";
import { sendInvitationEmail } from "../Utils/InviteFriend/InviteFriendEmail.js";
import { sendOtpEmail } from "../Utils/PasswordManagement/ManagePassword.js";

// Register a User
// Generates a verification token using crypto library
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Function to register a new user
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

  try {
    // Check if a user already exists with the provided email
    const userExistByEmail = await User.findOne({ email });
    if (userExistByEmail) {
      return res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // Check if a user already exists with the provided username
    const userExistByUsername = await User.findOne({ username });
    if (userExistByUsername) {
      return res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // Generate a verification token for the new user
    const verificationToken = generateVerificationToken();

    // Create a new user
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

    // Create a team with the user's full name as the team name and assign the user as the team leader
    const teamName = `${fName} ${lName}`;
    const team = await Team.create({
      teamName,
      teamLeader: NewUser._id,
    });

    // Add the team to the user's teams list and save the user
    NewUser.teams.push(team._id);
    await NewUser.save();

    // Generate a JWT token for the new user
    const token = NewUser.JWTTOKEN();

    // Add the user to the team members and save the team
    team.teamMembers.push(NewUser._id);
    await team.save();

    // Send a verification email to the user
    const options = { email, verificationToken };
    await sendEmailVerificationToken(options);

    // Respond with a success message and set a cookie with the JWT token
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User Registered, Check your Email to Verify!",
        NewUser,
      });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to verify a user's email
export const verifyUserEmail = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    // Find the user by the verification token
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Verification token is expired or invalid",
      });
    }

    // Mark the user as verified and remove the verification token
    user.verifiedUser = true;
    user.verificationToken = undefined;
    await user.save();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to resend the verification email
export const resendVerificationEmail = async (req, res) => {
  try {
    // Find the logged-in user by their ID
    const loggedInUser = await User.findById(req.user);

    // Check if the user's email is already verified
    if (loggedInUser.verifiedUser) {
      return res.status(401).json({
        success: false,
        message: "User Email is already Verified",
      });
    }

    // Clear any existing verification token and generate a new one
    loggedInUser.verificationToken = undefined;
    await loggedInUser.save();

    const verificationToken = generateVerificationToken();
    const options = { email: loggedInUser.email, verificationToken };
    await sendEmailVerificationToken(options);

    // Save the new verification token and respond with a success message
    loggedInUser.verificationToken = verificationToken;
    await loggedInUser.save();
    res.status(200).json({
      success: true,
      message: "Verification Email Sent!",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to check if the user is not verified
export const isNotVerifiedUser = async (req, res) => {
  try {
    // Find the logged-in user by their ID
    const loggedInUser = await User.findById(req.user);

    // Check if the user is not verified and respond accordingly
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
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Both Email and Password are compulsory",
      });
    }

    // Find the user by email
    const loggingInUser = await User.findOne({ email });
    if (!loggingInUser) {
      return res.status(403).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Compare the provided password with the stored password
    const isPasswordMatched = await loggingInUser.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Generate a JWT token for the user
    const token = loggingInUser.JWTTOKEN();

    // Respond with a success message and set a cookie with the JWT token
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged In Successfully",
        loggedInUser: loggingInUser,
      });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Function to get the details of the logged-in user
export const loggedInUser = async (req, res) => {
  try {
    // Find the logged-in user by their ID and populate their teams
    const loggedInUser = await User.findById(req.user).populate({
      path: "teams",
      populate: {
        path: "teamMembers",
        model: "User",
      },
    });

    // Check if the user exists and respond accordingly
    if (!loggedInUser) {
      return res.status(402).json({
        success: false,
        message: "User not found",
      });
    }

    // Respond with the user's details
    res.status(200).json({
      success: true,
      loggedInUser,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Function to logout the user
export const logout = async (req, res) => {
  try {
    // Clear the cookie with the JWT token and respond with a success message
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
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Function to add an admin
export const addAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const profilePic = req.file;

  try {
    // Check if an admin already exists with the provided email
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(401).json({
        success: false,
        message: "Admin Already Exists",
      });
    }

    // Create a new admin
    const NewUser = await User.create({
      name,
      email,
      password,
      userProfilePic: profilePic.filename,
    });

    // Respond with a success message and the new admin's details
    res.status(200).json({
      success: true,
      message: "Admin Added",
      NewUser,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to change the admin's password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the logged-in admin by their ID
    const loggedInAdmin = await User.findById(req.user);
    if (!loggedInAdmin) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Compare the provided old password with the stored password
    const passwordMatched = await loggedInAdmin.comparePassword(oldPassword);
    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Old Password not Matched",
      });
    }

    // Update the admin's password and respond with a success message
    loggedInAdmin.password = newPassword;
    await loggedInAdmin.save();
    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to update the admin's information
export const updateAdminInfo = async (req, res) => {
  const { name, email, password } = req.body;
  const profilePic = req.file;

  try {
    // Find the logged-in admin by their ID
    const loggedInAdmin = await User.findById(req.user);
    if (!loggedInAdmin) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Compare the provided password with the stored password
    const passwordMatched = await loggedInAdmin.comparePassword(password);
    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Password not Matched",
      });
    }

    // Update the admin's information and respond with a success message
    await User.findByIdAndUpdate(req.user, { name, email, profilePic });
    res.status(200).json({
      success: true,
      message: "Admin info Updated",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to get the details of a single user
export const singleUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by their ID
    const singleUser = await User.findById(userId);
    if (!singleUser) {
      return res.status(402).json({
        success: false,
        message: "User not found",
      });
    }

    // Respond with the user's details
    res.status(200).json({
      success: true,
      singleUser,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Function to get the details of the logged-in user
export const loggedInUserDetails = async (req, res) => {
  try {
    // Find the logged-in user by their ID and populate their team
    const loggedInUser = await User.findById(req.user).populate("team");

    // Check if the user exists and respond accordingly
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Not Logged In",
      });
    }

    // Respond with the user's details
    res.status(200).json({
      success: true,
      loggedInUser,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to update a user's role
export const updateUserRole = async (req, res) => {
  const { updatedUserRole } = req.body;

  try {
    const { userId } = req.params;

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not found",
      });
    }

    // Update the user's role and respond with a success message
    user.userRole = updatedUserRole;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User Role Updated",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to invite a friend to join the website
export const inviteFriendToWebsite = async (req, res) => {
  try {
    const { friendEmail } = req.body;

    // Check if the friend is already a registered user
    const isUserMember = await User.findOne({ email: friendEmail });

    // Find the logged-in user by their ID
    const loggedInUser = await User.findById(req.user);

    const baseUrl = `https://absfhc.com`;

    if (isUserMember) {
      return res.status(401).json({
        success: false,
        message: "User is already registered on Software",
      });
    }

    // Send an invitation email to the friend
    const senderName = loggedInUser.fName + " " + loggedInUser.lName;
    const options = {
      senderName,
      email: friendEmail,
      baseUrl,
    };
    await sendInvitationEmail(options);

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Invitation Link Sent!",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to handle forgot password
export const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate an OTP and save it to the user's record
    const otp = generateOtp(); // Assume this is a function that generates a random OTP
    user.resetPasswordOTP = otp;
    await user.save();

    // Send the OTP to the user's email
    const options = { email, otp };
    await sendOtpEmail(options);

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to generate an OTP (One-Time Password)
const generateOtp = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// Function to reset the user's password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the provided OTP matches the one saved in the user's record
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update the user's password and clear the OTP
    user.password = newPassword;
    user.resetPasswordOTP = undefined; // Clear the OTP
    await user.save();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Function to get the details of the logged-in user
export const myDetails = async (req, res) => {
  try {
    // Find the logged-in user by their ID
    const loggedInUser = await User.findById(req.user);
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Not Logged In",
      });
    }

    // Respond with the user's details
    res.status(200).json({
      success: true,
      loggedInUser,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to update the logged-in user's details
export const updateMyDetails = async (req, res) => {
  try {
    const {
      fName,
      lName,
      username,
      phoneNumber,
      companyName,
      address,
      country,
      timezone,
      city,
      stateProvince,
      zipPostalCode,
    } = req.body;

    const userId = req.user;

    // Create an object to hold the updated data
    const updateData = {};
    if (fName) updateData.fName = fName;
    if (lName) updateData.lName = lName;
    if (username) updateData.username = username;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (companyName) updateData.companyName = companyName;
    if (address) updateData.address = address;
    if (country) updateData.country = country;
    if (timezone) updateData.timezone = timezone;
    if (city) updateData.city = city;
    if (stateProvince) updateData.stateProvince = stateProvince;
    if (zipPostalCode) updateData.zipPostalCode = zipPostalCode;

    // Find the user by their ID and update their details
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run validation checks on the updated data
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Respond with the updated user's details
    res.json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
