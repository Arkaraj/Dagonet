import express from "express";
import morgan from "./logger/morgan";
require("dotenv-save").config();
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

// Connect to database here
import "./config/connection";

// use all the middlewires
app.use(cookieParser());

// Logging
app.use(morgan);

//Importing routes

//Routes

app.get("/", (_req, res) => {
  res.send("TruExam_Test Backend");
});

app.get("/api", (_req, res) => {
  res.send("TruExam_Test Backend routes");
});

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port} 🚀`);
});
