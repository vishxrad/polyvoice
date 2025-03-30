import subprocess

def embed_subtitles(video_path, subtitle_path, output_path):
    """
    Embeds subtitles into a video using FFmpeg.
    
    Parameters:
    - video_path (str): Path to the input video file.
    - subtitle_path (str): Path to the subtitle file (.srt, .ass).
    - output_path (str): Path to save the output video.
    - mode (str): "hard" for burned-in subtitles, "soft" for selectable subtitles.
    """

    
    command = [
        "ffmpeg", "-i", video_path, "-vf", f"subtitles={subtitle_path}",
        "-c:a", "copy", output_path
    ]
    try:
        subprocess.run(command, check=True)
        print(f"✅ Subtitles embedded successfully: {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error embedding subtitles: {e}")




