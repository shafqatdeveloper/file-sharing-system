import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "folder",
    required: true,
  },
  sellerSigned: {
    type: Boolean,
    default: false,
  },
  buyerSigned: {
    type: Boolean,
    default: false,
  },
  fields: [],
  uploadedOn: {
    type: Date,
    default: Date.now(),
  },
});

const FileUpload = mongoose.model("fileupload", fileSchema);
export default FileUpload;
