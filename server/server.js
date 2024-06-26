import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/UserRoute.js";
import { mongodbConnection } from "./Config/Connection.js";
import folderRouter from "./Routes/FolderRoute.js";
import fileRouter from "./Routes/FileRoute.js";

const app = express();

// Configuring DOTENV
dotenv.config({ path: "../server/Config/config.env" });

// Mongo DB
mongodbConnection();

// Configuring Cookie-Parser
app.use(cookieParser());

// Configuring Body-Parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// API Routes
app.use("/api", userRouter);
app.use("/api", folderRouter);
app.use("/api", fileRouter);

app.use(express.static("public"));
// Listening App
const port = 4000;
app.listen(port, () => {
  console.log(`App is Running on PORT : ${port}`);
});
