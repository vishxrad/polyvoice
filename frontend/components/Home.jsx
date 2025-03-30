import React from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";

const Home = () => {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomCode = Math.random().toString(10).substring(2, 8);
    socket.emit("createRoom", roomCode);
    navigate(`/room/${roomCode}?role=host`);
  };

  const joinRoom = () => {
    navigate("/join");
  };

  return (
    <div>
      <h1>Video Streaming & Chat App</h1>
      <button onClick={createRoom}>Create Room</button>
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default Home;
