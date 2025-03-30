import os
import whisper

def generate_subs(filename: str):
    upload_dir = "uploads"  
    os.makedirs(upload_dir, exist_ok=True)  
    
    def save_srt(segments, srt_filename):
        """ Saves the transcribed segments into an SRT file with precise timestamps. """
        with open(srt_filename, "w", encoding="utf-8") as srt_file:
            for i, segment in enumerate(segments, start=1):
                start_time = format_time(segment[0])
                end_time = format_time(segment[1])
                text = segment[2].strip()
                srt_file.write(f"{i}\n{start_time} --> {end_time}\n{text}\n\n")

    def format_time(seconds):
        """ Convert seconds to SRT timestamp format (HH:MM:SS,mmm) with precision. """
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        sec = int(seconds % 60)
        milliseconds = int((seconds - int(seconds)) * 1000)
        return f"{hours:02}:{minutes:02}:{sec:02},{milliseconds:03}"

    model = whisper.load_model("small")

    video_path = os.path.join(upload_dir, filename)  
    srt_path = os.path.join(upload_dir, f"{os.path.splitext(filename)[0]}.srt")
    
    result = model.transcribe(video_path)
    segments = [(seg["start"], seg["end"], seg["text"]) for seg in result["segments"]]
    
    save_srt(segments, srt_path)

    print("✅ SRT file saved with precise timestamps as", srt_path)

