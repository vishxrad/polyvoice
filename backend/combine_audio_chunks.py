import os
import subprocess
import glob
import re

def combine_em():
    def natural_sort_key(s):
        """
        Sort strings with numbers in natural order
        (e.g., file_1, file_2, file_10 instead of file_1, file_10, file_2)
        """
        return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

    def combine_audio(input_folder, output_file, file_pattern="video_*.wav"):
        """
        Combine multiple audio files into one using ffmpeg.
        Note: This function expects the .wav chunks in the input folder.
        """
        input_folder = os.path.abspath(input_folder)
        audio_files = glob.glob(os.path.join(input_folder, file_pattern))
        audio_files.sort(key=natural_sort_key)

        if not audio_files:
            print(f"⚠️ No audio files matching '{file_pattern}' found in '{input_folder}'")
            return None
        
        print(f"✅ Found {len(audio_files)} audio files to combine")

        temp_filelist = os.path.join(input_folder, "temp_filelist.txt")
        with open(temp_filelist, "w") as f:
            for audio in audio_files:
                f.write(f"file '{audio}'\n")
        
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
            print(f"🎵 Successfully combined audio into {output_file}")
            return output_file
        except subprocess.CalledProcessError as e:
            print(f"❌ Error combining audio: {e}")
            return None
        finally:
            if os.path.exists(temp_filelist):
                os.remove(temp_filelist)

    input_folder = "static/audio_chunks"
    output_file = "static/processed_video/combined_audio.wav"
    return combine_audio(input_folder, output_file)

def get_duration(filename):
    """Uses ffprobe to get duration of a media file in seconds."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", 
             "-of", "default=noprint_wrappers=1:nokey=1", filename],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=True
        )
        duration = float(result.stdout)
        print(f"⏳ Duration of {filename}: {duration} seconds")
        return duration
    except Exception as e:
        print(f"❌ Error getting duration for {filename}: {e}")
        return None

def build_atempo_filter(ratio):
    """
    Constructs an ffmpeg atempo filter chain to achieve the given ratio.
    atempo supports factors between 0.5 and 2.0, so we chain filters if needed.
    """
    filters = []
    while ratio > 2.0:
        filters.append("atempo=2.0")
        ratio /= 2.0
    while ratio < 0.5:
        filters.append("atempo=0.5")
        ratio /= 0.5
    filters.append(f"atempo={ratio:.6f}")
    return ",".join(filters)

def adjust_audio_duration(audio_file, target_duration, adjusted_audio_file):
    """Stretches or shrinks the audio file to match the target duration."""
    original_duration = get_duration(audio_file)
    if not original_duration:
        print("❌ Could not determine audio duration.")
        return False

    ratio = target_duration / original_duration
    print(f"🔧 Adjusting audio by a factor of: {ratio}")
    filter_chain = build_atempo_filter(ratio)
    print(f"🎛️ Using atempo filter chain: {filter_chain}")

    try:
        cmd = [
            "ffmpeg",
            "-i", audio_file,
            "-filter:a", filter_chain,
            "-y",  # Overwrite output if exists
            adjusted_audio_file
        ]
        subprocess.run(cmd, check=True)
        print(f"🎶 Audio adjusted and saved to {adjusted_audio_file}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error adjusting audio: {e}")
        return False

def merge_audio_video(video_file, audio_file, final_output):
    """Embeds the audio over the video while keeping the original video intact."""
    try:
        cmd = [
            "ffmpeg",
            "-i", video_file,
            "-i", audio_file,
            "-c:v", "copy",
            "-map", "0:v:0",
            "-map", "1:a:0",
            "-y",  # Overwrite output if exists
            final_output
        ]
        subprocess.run(cmd, check=True)
        print(f"🎥 Final output created: {final_output}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error merging audio and video: {e}")

if __name__ == "__main__":
    print("🚀 Starting Audio-Video Processing Pipeline...")

    # Step 1: Combine your .wav audio chunks into one big .wav file
    combined_audio = combine_em()
    if not combined_audio:
        print("❌ Audio combination failed. Skipping further steps.")
    else:
        print(f"🔊 Combined audio file: {combined_audio}")

        # Step 2: Get video duration from the uploaded video
        video_path = "uploads/uploaded_video.mp4"  # Ensure this file exists
        video_duration = get_duration(video_path)

        if video_duration is None:
            print("❌ Cannot proceed without video duration.")
        else:
            # Step 3: Adjust the combined audio to match video duration
            adjusted_audio = "static/processed_video/adjusted_audio.wav"
            if adjust_audio_duration(combined_audio, video_duration, adjusted_audio):
                print(f"🎵 Adjusted audio file: {adjusted_audio}")

                # Step 4: Merge the adjusted audio with the uploaded video
                final_output = "final_output.mp4"
                merge_audio_video(video_path, adjusted_audio, final_output)
            else:
                print("❌ Audio adjustment failed.")
