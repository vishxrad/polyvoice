import os
import subprocess
import glob
import re

def combine_all():
    def natural_sort_key(s):
        """
        Sort strings with numbers in natural order
        (e.g., file_1, file_2, file_10 instead of file_1, file_10, file_2)
        """
        return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

    def combine_videos(input_folder, output_file, file_pattern="chunk_*.mp4"):
        """
        Combine multiple video files into one using ffmpeg
        
        Args:
            input_folder: Folder containing the video files
            output_file: Path to save the combined video
            file_pattern: Pattern to match the video files (default: "file_*.mp4")
        """
        # Get absolute path of input folder
        input_folder = os.path.abspath(input_folder)
        
        # Get all video files matching the pattern
        video_files = glob.glob(os.path.join(input_folder, file_pattern))
        
        # Sort files in natural order (file_1, file_2, ..., file_10, etc.)
        video_files.sort(key=natural_sort_key)
        
        if not video_files:
            print(f"No video files matching '{file_pattern}' found in '{input_folder}'")
            return
        
        print(f"Found {len(video_files)} files to combine")
        
        # Create a temporary file list
        temp_filelist = os.path.join(input_folder, "temp_filelist.txt")
        with open(temp_filelist, "w") as f:
            for video in video_files:
                f.write(f"file '{video}'\n")
        
        # Combine videos using ffmpeg
        try:
            cmd = [
                "ffmpeg",
                "-f", "concat",
                "-safe", "0",
                "-i", temp_filelist,
                "-c", "copy",
                output_file
            ]
            
            subprocess.run(cmd, check=True)
            print(f"Successfully combined videos into {output_file}")
        
        except subprocess.CalledProcessError as e:
            print(f"Error combining videos: {e}")
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_filelist):
                os.remove(temp_filelist)

    # Call combine_videos() with an actual folder and output file
    input_folder = "static/combined_chunks"  # Change this to your actual folder
    output_file = "static/processed_video/processed_video.mp4"  # Change this to your desired output file name
    combine_videos(input_folder, output_file)

combine_all()
