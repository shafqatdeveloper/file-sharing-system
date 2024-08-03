import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  companyName: { type: String, required: true },
  aboutCompany: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  userRole: { type: String, default: "None" },
  companies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
  ],
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
  fax: { type: String, required: false },
  esignName: { type: String, required: false },
  esignInitials: { type: String, required: false },
  jobTitle: { type: String, required: false },
  tagline: { type: String, required: false },
  photo: { type: String, required: false },
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
