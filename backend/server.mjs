import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import fs from "fs";

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
  console.log("New client connected. Active sockets:", io.engine.clientsCount);

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
    console.log("Client disconnected. Active sockets:", io.engine.clientsCount);

    // Wait a short time before checking active sockets (to ensure no reconnections)
    setTimeout(() => {
      if (io.engine.clientsCount === 0) {
        console.log("No active sockets, deleting files...");

        fs.rm("uploads", { recursive: true, force: true }, (err) => {
          if (err) console.error("Error deleting 'uploads' folder:", err);
          else console.log("'uploads' folder deleted successfully!");
        });

        fs.rm("static/processed_video", { recursive: true, force: true }, (err) => {
          if (err) console.error("Error deleting 'static/processed_video' folder:", err);
          else console.log("'static/processed_video' folder deleted successfully!");
        });

        fs.rm("static/combined_chunks", { recursive: true, force: true }, (err) => {
          if (err) console.error("Error deleting 'static/processed_video' folder:", err);
          else console.log("'static/processed_video' folder deleted successfully!");
        });

        fs.rm("static/audio_chunks", { recursive: true, force: true }, (err) => {
          if (err) console.error("Error deleting 'static/processed_video' folder:", err);
          else console.log("'static/processed_video' folder deleted successfully!");
        });

        fs.rm("static/chunks", { recursive: true, force: true }, (err) => {
          if (err) console.error("Error deleting 'static/processed_video' folder:", err);
          else console.log("'static/processed_video' folder deleted successfully!");
        });
      }
    }, 500); // Small delay to avoid race conditions
  });
});

const PORT = 5001;
server.listen(PORT, () => console.log(`Socket.IO server running on port ${PORT}`));
