import subprocess

def extract_audio():
    command = [
        "ffmpeg", "-i", "uploads/uploaded_video.mp4", "-vn",
        "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2", "uploads/uploaded_video.wav"
    ]
    subprocess.run(command, check=True)

# Example usage

