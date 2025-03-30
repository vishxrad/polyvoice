import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import io from "socket.io-client";

// Connect to the Node backend for chat & room events
const socket = io("http://localhost:5001");

///////////////////////////
// Home Component
///////////////////////////
function Home() {
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
}

///////////////////////////
// JoinRoom Component
///////////////////////////
function JoinRoom() {
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
}

///////////////////////////
// UploadVideo Component
///////////////////////////
function UploadVideo({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [dubOption, setDubOption] = useState("dub");
  const [videoLanguage, setVideoLanguage] = useState("en");
  const { roomCode } = useParams(); // Get the current room code

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("dub_option", dubOption);
    formData.append("language", videoLanguage);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data.message);

      // Emit video uploaded event to notify other users in this specific room
      socket.emit("videoUploaded", roomCode);

      // Refresh the page for the uploader as well
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
    }
    setUploading(false);
  };

  return (
    <div>
      <h3>Upload Video</h3>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <div style={{ marginTop: "10px" }}>
        <label>Dub/Sub: </label>
        <select
          value={dubOption}
          onChange={(e) => setDubOption(e.target.value)}
        >
          <option value="dub">Dub</option>
          <option value="sub">Sub</option>
        </select>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label>Language: </label>
        <select
          value={videoLanguage}
          onChange={(e) => setVideoLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="hi">Hindi</option>
          <option value="fr">French</option>
        </select>
      </div>
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{ marginTop: "10px" }}
      >
        {uploading ? "Uploading..." : "Upload & Start Streaming"}
      </button>
    </div>
  );
}

///////////////////////////
// TranslatedMessage Component
///////////////////////////
function TranslatedMessage({ msg, targetLanguage }) {
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    if (!msg || !msg.message) return;
    fetch(
      `https://www.apertium.org/apy/translate?langpair=en|${targetLanguage}&q=${encodeURIComponent(
        msg.message
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTranslatedText(
          data.responseData ? data.responseData.translatedText : msg.message
        );
      })
      .catch((err) => {
        console.error("Translation error:", err);
        setTranslatedText(msg.message);
      });
  }, [msg, targetLanguage]);

  return <span>{translatedText || msg.message}</span>;
}

///////////////////////////
// Room Component
///////////////////////////
function Room() {
  const { roomCode } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "joiner";
  const [chunks, setChunks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const videoRef = useRef(null);
  const eventSourceRef = useRef(null);
  const isRemoteControlRef = useRef(false);

  // Compute currentChunk from chunks and currentIndex.
  const currentChunk = useMemo(
    () => chunks[currentIndex],
    [chunks, currentIndex]
  );

  // Start Server-Sent Events for streaming chunks
  const startSSE = () => {
    const streamUrl = `http://localhost:5000/stream/${role}`;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    const es = new EventSource(streamUrl);
    es.onmessage = (event) => {
      console.log("New chunk received:", event.data);
      // Append new chunk without affecting the currently playing one
      setChunks((prev) => [...prev, event.data]);
    };
    es.onerror = (err) => {
      console.error("EventSource error:", err);
      es.close();
    };
    eventSourceRef.current = es;
  };

  useEffect(() => {
    socket.emit("joinRoom", roomCode);

    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const handleVideoControl = (data) => {
      isRemoteControlRef.current = true;
      if (videoRef.current) {
        videoRef.current.currentTime = data.currentTime;
        data.action === "play" && videoRef.current.play();
        data.action === "pause" && videoRef.current.pause();
      }
    };

    // When video uploaded event is received, refresh the page
    const handleVideoUploaded = () => {
      console.log("New video uploaded - refreshing page");
      window.location.reload();
    };

    socket.on("message", handleMessage);
    socket.on("videoControl", handleVideoControl);
    socket.on("videoUploaded", handleVideoUploaded);

    return () => {
      socket.off("message", handleMessage);
      socket.off("videoControl", handleVideoControl);
      socket.off("videoUploaded", handleVideoUploaded);
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, [roomCode, role]);

  // Initialize SSE on mount and when role changes
  useEffect(() => {
    startSSE();
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, [role]);

  // Generate a random username on mount
  function generateFunnyName() {
    const adjectives = [
      "Silly",
      "Wacky",
      "Funky",
      "Zany",
      "Crazy",
      "Bubbly",
      "Jolly",
      "Cheeky",
      "Sassy",
    ];
    const nouns = [
      "Monkey",
      "Penguin",
      "Giraffe",
      "Unicorn",
      "Narwhal",
      "Koala",
      "Llama",
      "Ostrich",
      "Platypus",
    ];
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective} ${randomNoun}`;
  }

  useEffect(() => {
    setUserName(generateFunnyName());
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", { room: roomCode, message, user: userName });
      setMessage("");
    }
  };

  // Video control handlers
  const handleVideoPlay = () => {
    if (!isRemoteControlRef.current && videoRef.current) {
      socket.emit("videoControl", {
        room: roomCode,
        action: "play",
        currentTime: videoRef.current.currentTime,
      });
    }
    isRemoteControlRef.current = false;
  };

  const handleVideoPause = () => {
    if (!isRemoteControlRef.current && videoRef.current) {
      socket.emit("videoControl", {
        room: roomCode,
        action: "pause",
        currentTime: videoRef.current.currentTime,
      });
    }
    isRemoteControlRef.current = false;
  };

  const handleVideoSeeked = () => {
    if (!isRemoteControlRef.current && videoRef.current) {
      socket.emit("videoControl", {
        room: roomCode,
        action: "seek",
        currentTime: videoRef.current.currentTime,
      });
    }
    isRemoteControlRef.current = false;
  };

  // Load next chunk only when video ends
  const handleVideoEnded = () => {
    if (currentIndex < chunks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Update video source only when currentChunk changes.
  useEffect(() => {
    if (currentChunk && videoRef.current) {
      videoRef.current.src = currentChunk;
      videoRef.current.load();
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.catch((err) => console.error("Auto-play error:", err));
      };
    }
  }, [currentChunk]);

  return (
    <div>
      <h2>Room: {roomCode}</h2>
      <h2>
        Your Name:{" "}
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ width: "200px" }}
        />
      </h2>

      {role === "host" && <UploadVideo />}
      {chunks.length > 0 && (
        <video
          ref={videoRef}
          controls
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onSeeked={handleVideoSeeked}
          onEnded={handleVideoEnded}
          style={{ width: "100%", maxWidth: "1200px", marginTop: "20px" }}
        />
      )}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "20px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.user}:</strong>{" "}
            <TranslatedMessage msg={msg} targetLanguage={targetLanguage} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          style={{ width: "300px" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>Select chat language: </label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
      </div>
    </div>
  );
}

///////////////////////////
// App Component with Routing
///////////////////////////
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
