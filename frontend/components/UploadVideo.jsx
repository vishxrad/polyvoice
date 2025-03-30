import React, { useState } from "react";
import { useParams } from "react-router-dom";
import socket from "./socket";

const UploadVideo = () => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [dubOption, setDubOption] = useState("dub");
  const [videoLanguage, setVideoLanguage] = useState("en");
  const { roomCode } = useParams();

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
};

export default UploadVideo;
