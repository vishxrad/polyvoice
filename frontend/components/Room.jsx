import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import socket from "./socket";
import UploadVideo from "./UploadVideo";
import TranslatedMessage from "./TranslatedMessage";

const Room = () => {
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
        if (data.action === "play") videoRef.current.play();
        if (data.action === "pause") videoRef.current.pause();
      }
    };

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

  useEffect(() => {
    startSSE();
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, [role]);

  const generateFunnyName = () => {
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
  };

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

  const handleVideoEnded = () => {
    if (currentIndex < chunks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (currentChunk && videoRef.current) {
      videoRef.current.src = currentChunk;
      videoRef.current.load();
      videoRef.current.onloadedmetadata = () => {
        // Optionally, auto-play can be handled here.
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
};

export default Room;
