import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data.rooms))
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  const joinRoomByCode = () => {
    if (roomCodeInput.trim()) {
      navigate(`/room/${roomCodeInput}`);
    }
  };

  const joinExistingRoom = (roomCode) => {
    navigate(`/room/${roomCode}`);
  };

  return (
    <div>
      <h2>Join an Existing Room</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value)}
          placeholder="Enter Room Code"
        />
        <button onClick={joinRoomByCode}>Join Room</button>
      </div>
      <hr />
      <h3>Available Rooms</h3>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((roomCode) => (
            <li key={roomCode}>
              {roomCode}{" "}
              <button onClick={() => joinExistingRoom(roomCode)}>Join</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
};

export default JoinRoom;
