import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "./socket";
import { Button } from "@heroui/react";

const UploadVideo = () => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [dubOption, setDubOption] = useState("dub");
  const [videoLanguage, setVideoLanguage] = useState("en");
  const { roomCode } = useParams();
  const inputRef = useRef(null);

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
      // Emit video uploaded event to notify others in this room
      socket.emit("videoUploaded", roomCode);
      // Refresh the page for the uploader as well
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
    }
    setUploading(false);
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Styled Upload Box */}
      <br />
      <br />
      <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 mb-4">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center py-4">
          <svg
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> video
          </p>
          <p className="text-xs text-gray-500">MP4, MOV, AVI, etc.</p>
        </div>

        <button
          onClick={handleButtonClick}
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Select Video
        </button>
      </div>

      {/* Show selected file name */}
      {file && (
        <div className="mb-4 p-2 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-700 truncate">{file.name}</span>
          </div>
        </div>
      )}

      {/* Original option selectors */}
      <br />
      <div className="mb-3">
        <label className="mr-2 text-sm font-medium">Dub/Sub: </label>
        <select
          value={dubOption}
          onChange={(e) => setDubOption(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option value="dub">Dub</option>
          <option value="sub">Sub</option>
        </select>
      </div>
      <br />
      <div className="mb-4">
        <label className="mr-2 text-sm font-medium">Language: </label>
        <select
          value={videoLanguage}
          onChange={(e) => setVideoLanguage(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="hi">Hindi</option>
          <option value="fr">French</option>
        </select>
      </div>
      <br />

      {/* Original upload button */}
      <center>
        <Button
          variant="flat"
          color="success"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload & Start Streaming"}
        </Button>
      </center>
    </div>
  );
};

export default UploadVideo;
