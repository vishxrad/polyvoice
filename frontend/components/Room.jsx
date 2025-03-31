import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import socket from "./socket";
import UploadVideo from "./UploadVideo";
import TranslatedMessage from "./TranslatedMessage";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { Snippet } from "@heroui/react";

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
  const [theme, setTheme] = useState("dark");
  const [videoLoaded, setVideoLoaded] = useState(false);

  const currentChunk = useMemo(
    () => chunks[currentIndex],
    [chunks, currentIndex]
  );

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
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

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  useEffect(() => {
    if (currentChunk && videoRef.current) {
      setVideoLoaded(false);
      videoRef.current.src = currentChunk;
      videoRef.current.load();
      videoRef.current.onloadedmetadata = () => {
        // Set video as loaded when metadata is available
        handleVideoLoaded();
      };
    }
  }, [currentChunk]);

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #121212 0%, #1e1e1e 50%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f0f0f0 100%)",
      }}
    >
      {/* Navbar */}
      <Navbar style={{ backgroundColor: "rgb(28,28,28)" }}>
        <NavbarBrand>
          <p className="font-bold text-inherit text-xl">
            <strong>Poly Voice</strong>
          </p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center" />
        <NavbarContent justify="end">
          <NavbarItem>
            <Button onClick={toggleTheme} variant="flat" color="success">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="flex-1 flex flex-col">
        <h1
          style={{ fontSize: "50px", fontWeight: "bold" }}
          className="text-5xl font-extrabold text-center mb-6 mt-6"
        >
          <br />
          Invite To Room
        </h1>
        <h2
          style={{ fontSize: "20px", fontWeight: "bold" }}
          className="text-5xl font-extrabold text-center mb-6"
        >
          Room ID : <Snippet size="lg">{roomCode}</Snippet>
        </h2>
        <center>
          <h2>
            <br />
            Share This Code to Invite
          </h2>
        </center>
        <h2
          style={{ fontSize: "20px", fontWeight: "bold" }}
          className="text-5xl font-extrabold text-center mb-6 mt-6"
        >
          <br />
          Your Name:{" "}
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              width: "200px",
              textAlign: "center",
              borderRadius: "10px",
            }}
          />
        </h2>
        {role === "host" && <UploadVideo />}
        {chunks.length > 0 ? (
          <center>
            {!videoLoaded && (
             
             <div
             style={{
               width: "100%",
               maxWidth: "600px",
               height: "400px",
               margin: "20px auto",
               borderRadius: "20px",
               backgroundColor: "#222",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               flexDirection: "column",
             }}
           >
         <iframe  width="560" height="315" src="https://www.youtube.com/embed/YK9ixPwALIY?si=_6mwkBy5t3zS744w&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>            
         <p style={{ color: "#fff", marginTop: "20px", fontSize: "18px" }}>
               {role === "host"
                 ? "Upload a video to get started"
                 : "Waiting for host to upload a video"}
             </p>
           </div>
               

          
            )}
            <video
              ref={videoRef}
              controls
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onSeeked={handleVideoSeeked}
              onEnded={handleVideoEnded}
              style={{
                width: "100%",
                maxWidth: "1200px",
                marginTop: "20px",
                borderRadius: "20px",
                display: videoLoaded ? "block" : "none",
              }}
            />
          </center>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "400px",
              margin: "20px auto",
              borderRadius: "20px",
              backgroundColor: "#222",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
        <iframe  width="560" height="315" src="https://www.youtube.com/embed/YK9ixPwALIY?si=_6mwkBy5t3zS744w&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>            
        <p style={{ color: "#fff", marginTop: "20px", fontSize: "18px" }}>
              {role === "host"
                ? "Upload a video to get started"
                : "Waiting for host to upload a video"}
            </p>
          </div>
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
          <center>
            <br />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              style={{
                width: "300px",
                height: "30px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            />

            <Button
              style={{ marginLeft: "20px" }}
              variant="flat"
              color="success"
              onClick={sendMessage}
            >
              Send
            </Button>
          </center>
        </div>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <center>
            <label style={{ fontSize: "20px" }}>Select chat language: </label>
            <select
              style={{ borderRadius: "10px" }}
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Room;
