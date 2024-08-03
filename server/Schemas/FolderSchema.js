import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
  },
  folderAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fileupload",
      required: true,
    },
  ],
  folderType: {
    type: String,
    default: "None",
  },
  folderPic: {
    type: String,
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  parentCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
  accessors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Folder = mongoose.model("folder", folderSchema);
export default Folder;
