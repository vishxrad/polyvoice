import subprocess
import json
import os
import shutil

# Constants for file paths
SOURCE_VIDEO = "static/processed_video/not_processed_video.mp4"
TARGET_VIDEO = "uploads/uploaded_video.mp4"
OUTPUT_VIDEO = "static/processed_video/processed_video.mp4"
TEMP_DIR = "temp_processing"

def run_command(command):
    """Run a shell command and return the output."""
    try:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return result.stdout.strip(), result.stderr.strip()
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {' '.join(command)}")
        print(f"Error output: {e.stderr}")
        raise

def get_duration(filename):
    """Get the duration of a media file using ffprobe."""
    cmd = [
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'json', filename
    ]
    stdout, stderr = run_command(cmd)
    if stdout:
        info = json.loads(stdout)
        return float(info["format"]["duration"])
    else:
        raise Exception(f"Error getting duration for {filename}: {stderr}")

def extract_audio(video_file, output_audio):
    """Extract audio from a video file."""
    cmd = [
        'ffmpeg', '-y', '-i', video_file, '-vn', '-acodec', 'aac', 
        '-b:a', '192k', output_audio
    ]
    stdout, stderr = run_command(cmd)
    print(f"Extracted audio from {video_file} to {output_audio}")
    return output_audio

def stretch_audio(input_audio, output_audio, factor):
    """Stretch (or slow down) audio by a given factor using atempo filter."""
    print(f"Stretching audio by factor: {factor}")
    
    # FFMPEG's atempo filter only works between 0.5 and 2.0
    if factor < 0.5 or factor > 2.0:
        # Calculate a series of atempo values that multiply to our target factor
        atempo_chain = []
        remaining = factor
        
        # Handle extreme slowdowns (factor < 0.5)
        while remaining < 0.5:
            atempo_chain.append(0.5)
            remaining /= 0.5
            
        # Handle extreme speedups (factor > 2.0)
        while remaining > 2.0:
            atempo_chain.append(2.0)
            remaining /= 2.0
            
        # Add the final adjustment factor
        if 0.5 <= remaining <= 2.0:
            atempo_chain.append(remaining)
            
        # Create the filter string
        filter_str = ','.join([f"atempo={f}" for f in atempo_chain])
        print(f"Using chained atempo filters: {filter_str}")
    else:
        filter_str = f"atempo={factor}"
        print(f"Using single atempo filter: {filter_str}")
    
    cmd = [
        'ffmpeg', '-y', '-i', input_audio, '-filter:a', filter_str, output_audio
    ]
    
    stdout, stderr = run_command(cmd)
    print(f"Stretched audio saved to {output_audio}")
    return output_audio

def replace_audio(video_file, audio_file, output_video):
    """Replace the audio in video_file with audio_file and save as output_video."""
    cmd = [
        'ffmpeg', '-y', '-i', video_file, '-i', audio_file,
        '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', output_video
    ]
    stdout, stderr = run_command(cmd)
    print(f"Created video with replaced audio: {output_video}")
    return output_video

def process_videos():
    """
    Process videos by:
    1. Extract audio from SOURCE_VIDEO (not_processed_video.mp4)
    2. Adjust this audio to match TARGET_VIDEO (uploaded_video.mp4) length
    3. Replace audio in TARGET_VIDEO with the adjusted audio to create OUTPUT_VIDEO
    """
    # Create temp directory
    os.makedirs(TEMP_DIR, exist_ok=True)
    
    # Get durations
    source_duration = get_duration(SOURCE_VIDEO)
    target_duration = get_duration(TARGET_VIDEO)
    
    print(f"Source video duration: {source_duration:.2f} seconds")
    print(f"Target video duration: {target_duration:.2f} seconds")
    
    # Extract audio from source video
    source_audio = os.path.join(TEMP_DIR, "source_audio.aac")
    extract_audio(SOURCE_VIDEO, source_audio)
    
    # Prepare the processed audio file path
    processed_audio = os.path.join(TEMP_DIR, "processed_audio.aac")
    
    # Check if we need to adjust the audio
    if abs(source_duration - target_duration) < 0.1:
        print("Videos are approximately the same length. No stretching needed.")
        # Just use the original source audio
        shutil.copy(source_audio, processed_audio)
    else:
        # Need to adjust the audio to match target video length
        stretch_factor = target_duration / source_duration
        if stretch_factor > 1:
            print(f"Stretching audio by factor {stretch_factor:.4f} to match target video length")
        else:
            print(f"Compressing audio by factor {stretch_factor:.4f} to match target video length")
        
        stretch_audio(source_audio, processed_audio, stretch_factor)
    
    # Replace audio in target video with processed audio
    replace_audio(TARGET_VIDEO, processed_audio, OUTPUT_VIDEO)
    
    print(f"Processing complete! Output saved to: {OUTPUT_VIDEO}")
    print(f"Both {TARGET_VIDEO} and {OUTPUT_VIDEO} have the same video content but different audio.")
    
    return OUTPUT_VIDEO

def clean_temp_files():
    """Clean up temporary files."""
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
        print(f"Cleaned up temporary directory: {TEMP_DIR}")

def final_conversion():
    """Run the process with the default file paths."""
    try:
        return process_videos()
    finally:
        clean_temp_files()

if __name__ == "__main__":
    final_conversion()