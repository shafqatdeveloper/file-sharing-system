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
const app = express();

// Configuring DOTENV
dotenv.config({ path: "../server/Config/config.env" });

// Mongo DB
mongodbConnection();

// Configuring Cookie-Parser
app.use(cookieParser());

// Configuring Body-Parser
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use(cors());

// API Routes
app.use("/api", userRouter);
app.use("/api", folderRouter);
app.use("/api", fileRouter);
app.use("/api", companyRouter);
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
// Listening App
const port = 4000;
app.listen(port, () => {
  console.log(`App is Running on PORT : ${port}`);
});
