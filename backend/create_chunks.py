import os
import pysrt
from moviepy.video.io.VideoFileClip import VideoFileClip

def chunk_original_video():
    subs = pysrt.open("uploads/uploaded_video.srt")

    # Load video
    video = VideoFileClip("uploads/uploaded_video.mp4")

    # Create output directory
    output_folder = "static/chunks"
    os.makedirs(output_folder, exist_ok=True)

    # Loop through SRT and extract clips
    for i, sub in enumerate(subs, start=1):  # Start index from 1
        start_time = sub.start.ordinal / 1000  # Convert ms to seconds
        end_time = sub.end.ordinal / 1000  # Convert ms to seconds
        
        clip = video.subclipped(start_time, end_time)
        
        # Save each chunk in the "chunks" folder
        output_path = os.path.join(output_folder, f"chunk_{i}.mp4")
        clip.write_videofile(output_path, codec="libx264")

    print(f"Chunks saved in '{output_folder}' folder! ")
