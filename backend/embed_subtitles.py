import subprocess
import os

def embeded_sub():
    try:
        print("Starting embeded_sub function...111")
        input_video = "uploads/uploaded_video.mp4"
        input_subtitles = "uploads/uploaded_video.srt"
        output_video = "uploads/uploaded_video2.mp4"
        
        print(f"Checking file paths:")
        print(f"Input video exists: {os.path.exists(input_video)}")
        print(f"Input subtitles exists: {os.path.exists(input_subtitles)}")
        
        # Check if files exist before running ffmpeg
        if not os.path.exists(input_video):
            print(f"Error: {input_video} not found!")
            return
        
        if not os.path.exists(input_subtitles):
            print(f"Error: {input_subtitles} not found!")
            return
        
        # Try running a simple ffmpeg command first to check if ffmpeg is available
        print("Testing ffmpeg availability...")
        try:
            test_cmd = ["ffmpeg", "-version"]
            subprocess.run(test_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print("ffmpeg is available.")
        except Exception as e:
            print(f"ffmpeg test failed: {e}")
            return
        
        # Now try the actual command
        command = [
            "ffmpeg", "-i", input_video,
            "-vf", f"subtitles={input_subtitles}",
            "-y",
            output_video
        ]
        
        print(f"Running command: {' '.join(command)}")
        
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        print("FFmpeg command completed with return code:", result.returncode)
        
        if result.stdout:
            print("FFmpeg Output:", result.stdout)
        
        if result.stderr:
            print("FFmpeg Error:", result.stderr)
        
        if result.returncode != 0:
            print("FFmpeg failed!")
        else:
            print(f"FFmpeg succeeded. Output video should be at: {output_video}")
            print(f"Output video exists: {os.path.exists(output_video)}")
    
    except Exception as e:
        print(f"Error in embeded_sub: {e}")
        import traceback
        traceback.print_exc()

    try:
        print("Starting embeded_sub function...111")
        input_video = "static/processed_video/processed_video.mp4"
        input_subtitles = "static/translated.srt"
        output_video = "static/processed_video/processed_video2.mp4"
        
        print(f"Checking file paths:")
        print(f"Input video exists: {os.path.exists(input_video)}")
        print(f"Input subtitles exists: {os.path.exists(input_subtitles)}")
        
        # Check if files exist before running ffmpeg
        if not os.path.exists(input_video):
            print(f"Error: {input_video} not found!")
            return
        
        if not os.path.exists(input_subtitles):
            print(f"Error: {input_subtitles} not found!")
            return
        
        # Try running a simple ffmpeg command first to check if ffmpeg is available
        print("Testing ffmpeg availability...")
        try:
            test_cmd = ["ffmpeg", "-version"]
            subprocess.run(test_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print("ffmpeg is available.")
        except Exception as e:
            print(f"ffmpeg test failed: {e}")
            return
        
        # Now try the actual command
        command = [
            "ffmpeg", "-i", input_video,
            "-vf", f"subtitles={input_subtitles}",
            "-y",
            output_video
        ]
        
        print(f"Running command: {' '.join(command)}")
        
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        print("FFmpeg command completed with return code:", result.returncode)
        
        if result.stdout:
            print("FFmpeg Output:", result.stdout)
        
        if result.stderr:
            print("FFmpeg Error:", result.stderr)
        
        if result.returncode != 0:
            print("FFmpeg failed!")
        else:
            print(f"FFmpeg succeeded. Output video should be at: {output_video}")
            print(f"Output video exists: {os.path.exists(output_video)}")
    
    except Exception as e:
        print(f"Error in embeded_sub: {e}")
        import traceback
        traceback.print_exc()

