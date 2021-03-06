const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const mysql = require("mysql");

const server = http.createServer(app);

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "carping",
});

app.get("/", (req, res) => {
  sqlSelect = "SELECT * FROM posts";
  db.query(sqlSelect, (err, result) => {
    console.log(result);
    res.send(result);
  });
});

const io = new Server(server, {
  cors: {
    origin: "https://pink-goat-63.loca.lt",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);

    sqlSelect = "SELECT * FROM chat WHERE room = ? ";
    db.query(sqlSelect, data, (err, result) => {
      console.log(result);
      socket.emit("first_messages", result);
    });
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async (data) => {
    const sqlInsert =
      "INSERT INTO chat (room, author, message, time) VALUES (?, ?, ?, ?)";
    await db.query(
      sqlInsert,
      [data.room, data.author, data.message, data.time],
      (err, result) => {
        if (err) console.log(err);
      }
    );
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
