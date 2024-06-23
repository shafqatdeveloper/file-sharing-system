import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
  },
  admin: {
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
});

const Folder = mongoose.model("folder", folderSchema);
export default Folder;
