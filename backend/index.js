const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const {Server} = require("socket.io");


const app = express();
require("dotenv").config();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/messages",messageRoute)
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

mongoose.connect(uri)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));



const expressServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = new Server(expressServer,{ cors: { origin: process.env.CLIENT_URL } });

let onlineUsers = [];

io.on("connection", (socket) => {
  //listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    io.emit("getOnlineUsers", onlineUsers);
  });
  //add new message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
    });


  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});
