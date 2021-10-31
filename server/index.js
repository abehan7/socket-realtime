const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const mysql = require("mysql");

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
    const sqlSelect = "SELECT * FROM chat WHERE room = ?";
    db.query(sqlSelect, data, async (err, result) => {
      if (err) console.log(err);
      var index = result.length;
      // console.log(result);
      console.log("입장시 데이터 db에서 불러옴");
      console.log(result[index - 1]);
      socket.emit("first_messages", result);
    });
  });

  socket.on("send_message", async (data) => {
    const sqlInsert =
      "INSERT INTO chat (room, author, message, time) VALUES (?, ?, ?, ?)";
    await db.query(
      sqlInsert,
      [data.room, data.author, data.message, data.time],
      (err, result) => {
        if (err) console.log(err);
        // socket.emit("receive_message");
      }
    );
    // setTimeout
    setTimeout(() => {
      const sqlSelect = "SELECT * FROM chat WHERE room = ?";
      db.query(sqlSelect, [data.room], (err, result) => {
        var index = result.length;

        console.log(result[index - 1]);
      });
    }, 10);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING on 3001");
});
