import jwt from "jsonwebtoken";
import User from "../../Schemas/UserSchema.js";
import Folder from "../../Schemas/FolderSchema.js";

export const isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Please Login First",
    });
  } else {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    const decoded = jwt.decode(token, { complete: true });
    next();
  }
};

export const authenticateFolderAcess = async (req, res, next) => {
  const { folderToken } = req.cookies;
  if (!folderToken) {
    res.status(401).json({
      success: false,
      message: "Please Login First",
    });
  } else {
    const decodedData = jwt.verify(folderToken, process.env.JWT_SECRET);
    req.folder = await Folder.findById(decodedData.id);
    const decoded = jwt.decode(folderToken, { complete: true });
    next();
  }
};

export const auhtorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(404).json({
        success: false,
        message: "Not Authorized",
      });
    } else {
      next();
    }
  };
};

export const authorizeVerifiedUser = () => {
  return (req, res, next) => {
    if (!req.user || !req.user.verifiedUser) {
      res.status(403).json({
        success: false,
        message: "Access forbidden: User is not verified",
      });
    } else {
      next();
    }
  };
};
