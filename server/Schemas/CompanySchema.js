import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  folders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "folder",
      required: true,
    },
  ],
  companyType: {
    type: String,
    default: "None",
  },
  companyPic: {
    type: String,
    required: true,
  },
  accessors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  archived: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Company = mongoose.model("company", companySchema);
export default Company;
