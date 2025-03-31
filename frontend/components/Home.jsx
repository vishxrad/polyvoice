import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";

const Home = () => {
  const createRoom = () => {
    const roomCode = Math.random().toString(10).substring(2, 8);
    socket.emit("createRoom", roomCode);
    navigate(`/room/${roomCode}?role=host`);
  };

  const joinRoom = () => {
    navigate("/join");
  };

  const currentYear = new Date().getFullYear();
  const [theme, setTheme] = useState("dark");

  const [hoverSide, setHoverSide] = useState(null);

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
  const navigate = useNavigate();
  const getStarted = () => {
    navigate("/home");
  };
  const joinCommunity = () => {
    navigate("/join");
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 w-full"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #121212 0%, #1e1e1e 50%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f0f0f0 100%)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
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
      {/* Main Content */}
      <div className="flex flex-row flex-grow">
        <div
          className="p-8 max-w-6xl mx-auto transition-all duration-300"
          style={{
            filter: hoverSide === "join" ? "blur(3px)" : "none",
          }}
          onMouseEnter={() => setHoverSide("create")}
          onMouseLeave={() => setHoverSide(null)}
        >
          <br />
          <br />
          <br />
          <br />
          <h1
            style={{ fontSize: "50px", fontWeight: "bold" }}
            className="text-5xl font-extrabold text-center mb-6"
          >
            Create Room
          </h1>
          <br />
          <br />
          <p style={{ fontSize: "20px" }} className="text-lg text-center mb-10">
            When a user creates a room, our platform sets up a dedicated virtual
            watching space using our Flask-based backend.
          </p>
          <br />
          <br />
          <center>
            <Button
              onClick={createRoom}
              variant="flat"
              color="success"
              title="Create"
              size="lg"
            >
              Create
            </Button>
          </center>
        </div>
        <div
          className="p-8 max-w-6xl mx-auto transition-all duration-300"
          style={{
            filter: hoverSide === "create" ? "blur(3px)" : "none",
          }}
          onMouseEnter={() => setHoverSide("join")}
          onMouseLeave={() => setHoverSide(null)}
        >
          <br />
          <br />
          <br />
          <br />
          <h1
            style={{ fontSize: "50px", fontWeight: "bold" }}
            className="text-5xl font-extrabold text-center mb-6"
          >
            Join Room
          </h1>
          <br />
          <br />
          <p style={{ fontSize: "20px" }} className="text-lg text-center mb-10">
            Users can join any existing watching room effortlessly.They are
            immediately connected to the synchronized playback stream
          </p>
          <br />
          <br />
          <center>
            <Button
              onClick={joinRoom}
              variant="flat"
              color="success"
              title="Join Room"
              size="lg"
            >
              Join
            </Button>
          </center>
        </div>
      </div>
      {/* Footer */}
      <footer className="text-center py-4 bg-gray-200 dark:bg-gray-700 mt-auto w-full">
        <p>&copy; {currentYear} Poly Voice. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
