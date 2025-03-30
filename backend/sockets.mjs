import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors()); // Allow all origins for development

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Minimal socket connection to test real-time features.
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = 5001;
server.listen(PORT, () =>
  console.log(`Socket.IO server running on port ${PORT}`)
);
