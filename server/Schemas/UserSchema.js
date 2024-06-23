import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  resetPasswordPin: String,
  userProfilePic: String,
});

// Hashing Password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

// Generating JSON Web Token
userSchema.methods.JWTTOKEN = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

// Comparing Password

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("user", userSchema);
export default User;
