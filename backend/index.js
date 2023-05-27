const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("./config/Database.js");
const userRoute = require("./routes/UserRoute.js");
const cors = require("cors");

const app = express();

dotenv.config();

(async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoute);

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
