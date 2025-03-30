import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// In-memory storage for room codes
let rooms = [];

// Endpoint to get the list of available rooms
app.get("/rooms", (req, res) => {
  res.json({ rooms });
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("createRoom", (room) => {
    if (!rooms.includes(room)) {
      rooms.push(room);
      console.log("Room created:", room);
      io.emit("roomsUpdated", rooms);
    }
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.currentRoom = room;
    const roomMembers = io.sockets.adapter.rooms.get(room)?.size || 0;
    io.to(room).emit("roomMembers", roomMembers);
    io.to(room).emit("message", {
      user: "System",
      message: "A user has joined the room.",
    });
  });

  socket.on("chatMessage", (data) => {
    const { room, message, user } = data;
    io.to(room).emit("message", { user: user || "Anonymous", message });
  });

  socket.on("videoControl", (data) => {
    const { room } = data;
    socket.to(room).emit("videoControl", data);
  });

  socket.on("videoUploaded", (roomCode) => {
    console.log("Video uploaded in room:", roomCode);
    io.to(roomCode).emit("videoUploaded");
  });

  socket.on("disconnect", () => {
    if (socket.currentRoom) {
      const roomMembers =
        io.sockets.adapter.rooms.get(socket.currentRoom)?.size || 0;
      io.to(socket.currentRoom).emit("roomMembers", roomMembers);
    }
    console.log("Client disconnected");
  });
});

const PORT = 5001;
server.listen(PORT, () =>
  console.log(`Socket.IO server running on port ${PORT}`)
);
