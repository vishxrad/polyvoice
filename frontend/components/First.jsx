import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { Accordion, AccordionItem } from "@heroui/react";

export default function First() {
  const currentYear = new Date().getFullYear();
  const [theme, setTheme] = useState("dark");
  const [accordionWidth, setAccordionWidth] = useState("80%");

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
      className="min-h-screen transition-colors duration-300"
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
            <Button onClick={getStarted} variant="ghost" color="success">
              Get Started
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button onClick={toggleTheme} variant="flat" color="success">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        <h1
          style={{ fontSize: "50px", fontWeight: "bold" }}
          className="text-5xl font-extrabold text-center mb-6"
        >
          Welcome to Poly Voice
        </h1>
        <br />
        <br />
        <p style={{ fontSize: "20px" }} className="text-lg text-center mb-10">
          Discover engaging content, interactive features, and a community built
          around sharing ideas. Watch our featured video below to learn more!
        </p>
        <br />
        <br />
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Video Section */}
          <div className="flex-1">
            <iframe
              style={{
                width: "800px",
                height: "460px",

                borderRadius: "12px",
              }}
              src="https://www.youtube.com/embed/9OqoRxXUjGA?si=jmIfJsE2pLpXPXY6"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Text Section */}
          <div className="flex-1 text-center">
            <br />
            <br />
            <Button
              size="lg"
              onClick={getStarted}
              variant="flat"
              color="success"
            >
              Explore Now
            </Button>
            <br />
            <br />
            <h2
              style={{ fontSize: "50px", fontWeight: "bold" }}
              className="text-3xl font-bold mb-4"
            >
              About Poly Voice
            </h2>

            <br />
            <br />
            <br />
            <center>
              <p
                style={{
                  fontSize: "20px",
                  width: "65%",
                  border: "1.5px solid lightgreen",
                  padding: "20px",
                  borderRadius: "20px",
                }}
                className="mb-4"
              >
                Poly Voice, aims to break down language barriers in accessing
                digital media. We're building a platform that provides accurate,
                real-time subtitles and audio dubbing using cutting-edge
                open-source technologies like Whisper for speech-to-text,
                Facebook's NLLB for translation, and Coqui TTS for voice
                synthesis. Our backend, built with the Flask framework,
                leverages FFmpeg for media processing and uses WebSockets (via
                Node.js) for real-time communication. This allows us to create
                dedicated watching rooms where users can simultaneously view the
                same video, each with their preferred language subtitles or
                dubbing, perfectly synchronized with other viewers in the room.
                Furthermore, within these rooms, we're utilizing a JavaScript
                translation API to enable real-time translation of chat
                messages, allowing users with different language preferences to
                communicate seamlessly with each other. The user interface is
                being developed with the React library and styled with Hero UI,
                ensuring a seamless and interactive experience for multilingual
                audiences, all while utilizing only open-source solutions.
              </p>
            </center>
            <br />
          </div>
        </div>

        {/* FAQ Section */}
        <div
          className="mt-16"
          style={{ width: accordionWidth, marginLeft: "150px" }}
        >
          <br />
          <h2
            style={{ fontSize: "100px" }}
            className="text-4xl font-bold text-center mb-6"
          >
            FAQs
          </h2>
          <br />
          <center>
            <Accordion variant="bordered">
              <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title="What is Poly Voice?"
              >
                Poly Voice is an innovative, open-source platform delivering
                synchronized, real-time subtitles, dubbing, and chat translation
                for a global, multilingual digital media experience.
              </AccordionItem>
              <AccordionItem
                key="2"
                aria-label="Accordion 2"
                title="How can I get started?"
              >
                Create or join a watching room, select your preferred language
                for subtitles or dubbing, and enjoy synchronized videos with
                real-time multilingual chat translation.
              </AccordionItem>
              <AccordionItem
                key="3"
                aria-label="Accordion 3"
                title="Do I need to install any software to use Poly Voice?"
              >
                No, Poly Voice is a web-based platform, so you can access it
                directly from your browser without any additional software
                installation.
              </AccordionItem>
              <AccordionItem
                key="4"
                aria-label="Accordion 3"
                title="Can I upload my own videos for translation and dubbing?"
              >
                Yes, users can upload videos, and our system will process them
                using Whisper, NLLB, and Coqui TTS for subtitles and dubbing.
              </AccordionItem>
              <AccordionItem
                key="5"
                aria-label="Accordion 3"
                title="Can I invite friends to watch videos together?"
              >
                Yes! You can create a room, share the invite link, and watch
                videos in sync with your friends, each with their preferred
                language settings.
              </AccordionItem>
              <AccordionItem
                key="6"
                aria-label="Accordion 3"
                title="Can I use Poly Voice for educational or professional purposes?"
              >
                Absolutely! Poly Voice is great for language learning, business
                meetings, and global content sharing with real-time translation
                and dubbing.
              </AccordionItem>
            </Accordion>
            <br />
          </center>
        </div>

        {/* Secondary Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to be part of the conversation?
          </h2>
          <p className="mb-6">
            Whether you're here to learn, share, or connect, there's a place for
            you at Poly Voice.
          </p>

          <br />
          <br />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 bg-gray-200 dark:bg-gray-700">
        <p>&copy; {currentYear} Poly Voice. All rights reserved.</p>
      </footer>
    </div>
  );
}
