const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const router = require("./api/routes/Routes");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "5mb" }));
app.use("/", router);

// mongoose
//   .connect(process.env.DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

const server = app.listen(process.env.PORT, () => {
  console.log("Server is running : " + process.env.PORT);
});

// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });
