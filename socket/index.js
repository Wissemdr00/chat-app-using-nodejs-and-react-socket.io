const { Server } = require("socket.io");

const io = new Server({ cors: { origin: "*" } });

let onlineUsers = [];

io.on("connection", (socket) => {
  //listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ 
        userId,
        socketId: socket.id 
    });
    console.log("online users",onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
