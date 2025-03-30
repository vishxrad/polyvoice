import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Video Chat App</h1>
      <button onClick={() => navigate("/create")}>Create Room</button>
      <button onClick={() => navigate("/join")}>Join Room</button>
    </div>
  );
}

function CreateRoom() {
  return (
    <div>
      <h2>Create Room</h2>
      <p>Room creation functionality coming soon...</p>
    </div>
  );
}

function JoinRoom() {
  return (
    <div>
      <h2>Join Room</h2>
      <p>Room joining functionality coming soon...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
