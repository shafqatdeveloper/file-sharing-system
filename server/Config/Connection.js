import mongoose from "mongoose";

export const mongodbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log(`Connected to Database Successfully`);
  } catch (error) {
    console.log("Error while connecting to Database");
  }
};
