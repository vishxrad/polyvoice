import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { InputOtp } from "@heroui/react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";

const JoinRoom = () => {
  const [value, setValue] = React.useState("");
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

      <h2
        style={{ fontSize: "50px", fontWeight: "bold" }}
        className="text-5xl font-extrabold text-center mb-6"
      >
        <br />
        Join an Existing Room
      </h2>
      <div style={{ marginBottom: "20px" }}>
        <center>
          <InputOtp
            length={6}
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value)}
          />
          <h2>Enter the Joining Code Here</h2>
          <br />
          <Button
            onClick={joinRoomByCode}
            variant="flat"
            color="success"
            title="Create"
            size="lg"
          >
            Join Room
          </Button>
        </center>
      </div>
      <hr />

      <h3
        style={{ fontSize: "50px", fontWeight: "bold" }}
        className="text-5xl font-extrabold text-center mb-6"
      >
        <br />
        Available Rooms
      </h3>

      {rooms.length > 0 ? (
        <div className="flex flex-row gap-4 mt-4 items-center justify-center">
          <br />
          {rooms.map((roomCode) => (
            <Card className="py-4 my-4">
              <CardHeader className="pb-2 pt-2 px-4 flex-col ">
                <p className="text-tiny uppercase font-bold">
                  {" "}
                  {roomCode}
                  <br /> <br />
                </p>

                <Button
                  variant="flat"
                  color="success"
                  title="Create"
                  size="lg"
                  onClick={() => joinExistingRoom(roomCode)}
                >
                  Join
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p
          style={{ fontSize: "20px", fontWeight: "bold" }}
          className="text-5xl font-extrabold text-center mb-6"
        >
          <br />
          No rooms available.
        </p>
      )}
    </div>
  );
};

export default JoinRoom;
