import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/UserRoute.js";
import { mongodbConnection } from "./Config/Connection.js";
import folderRouter from "./Routes/FolderRoute.js";
import fileRouter from "./Routes/FileRoute.js";
import path from "path";
import companyRouter from "./Routes/CompanyRoute.js";
import TeamRouter from "./Routes/TeamRoute.js";

const app = express();

// Configuring DOTENV to load environment variables from the .env file
dotenv.config({ path: "../server/Config/config.env" });

// Connect to MongoDB
mongodbConnection();

// Configuring Cookie-Parser to parse cookies in requests
app.use(cookieParser());

// Configuring Body-Parser to parse JSON and URL-encoded data with a limit of 100mb
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Define the API routes
app.use("/api", userRouter); // Routes for user-related operations
app.use("/api", folderRouter); // Routes for folder-related operations
app.use("/api", fileRouter); // Routes for file-related operations
app.use("/api", companyRouter); // Routes for company-related operations
app.use("/api", TeamRouter); // Routes for team-related operations

// Serve static files from the uploads directory
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Start the server and listen on port 4000
const port = 4000;
app.listen(port, () => {
  console.log(`App is Running on PORT: ${port}`);
});
