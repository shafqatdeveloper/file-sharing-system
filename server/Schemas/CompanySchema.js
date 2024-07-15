import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Company = mongoose.model("company", companySchema);
export default Company;
