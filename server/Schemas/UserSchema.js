import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  userRole: { type: String, default: "None" },
  email: { type: String, required: true, unique: true },
  fax: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  esignName: { type: String, required: false },
  esignInitials: { type: String, required: false },
  companyName: { type: String, required: false },
  jobTitle: { type: String, required: false },
  tagline: { type: String, required: false },
  photo: { type: String, required: false },
  password: { type: String, required: true },
  verificationToken: { type: String },
  verifiedUser: {
    type: Boolean,
    default: false,
  },
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

const User = mongoose.model("User", userSchema);
export default User;
