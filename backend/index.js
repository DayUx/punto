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

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log("Server is running : " + process.env.PORT);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.io = io;
global.games = [];
io.on("connection", (socket) => {
  socket.on("gamelist", (data) => {
    try {
      const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
      if (decoded) {
        socket.join("gamelist");
      }
    } catch (e) {}
  });

  socket.on("joingame", (data) => {
    try {
      const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
      if (decoded) {
        socket.join(data.gameId);
      }
    } catch (e) {}
  });
  socket.on("playGame", (data) => {
    try {
      const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
      if (decoded) {
        if (global.games[data.id]) {
          socket.join(data.id);
          socket.join(decoded.id);
          global.games[data.id].setUserOk(decoded.id);
        }
      }
    } catch (e) {}
  });
  socket.on("placeCard", async (data) => {
    try {
      const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
      if (decoded) {
        if (global.games[data.gameId]) {
          await global.games[data.gameId].checkPlay(decoded.id, data.x, data.y);
        }
      }
    } catch (e) {}
  });

  socket.on("leave", () => {
    try {
      socket.leaveAll();
    } catch (e) {}
  });
});
