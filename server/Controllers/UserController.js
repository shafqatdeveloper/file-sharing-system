import Folder from "../Schemas/FolderSchema.js";
import User from "../Schemas/UserSchema.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const profilePic = req.file;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    } else {
      const NewUser = await User.create({
        name,
        email,
        password,
        userProfilePic: profilePic.filename,
      });
      const token = NewUser.JWTTOKEN();
      res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .json({
          success: true,
          message: "User Registered",
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
        message: "Admin not found",
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

// Add User and Create a Folder

export const AddUserAndFolder = async (req, res) => {
  const { folderName, email, password } = req.body;
  const profilePic = req.file;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    } else {
      const NewUser = await User.create({
        name: folderName,
        email,
        password,
        userProfilePic: profilePic?.filename,
      });
      await Folder.create({
        folderName,
        admin: NewUser._id,
      });
      res.status(200).json({
        success: true,
        message: "User Registered",
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
