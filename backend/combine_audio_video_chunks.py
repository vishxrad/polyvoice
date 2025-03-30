import os
import subprocess
import json

def combine():
    def get_duration(file_path):
        """Get the duration of a media file using ffprobe."""
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'json',
            file_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        data = json.loads(result.stdout)
        return float(data['format']['duration'])

    def process_files():
        video_folder = "static/chunks"
        audio_folder = "static/audio_chunks"
        output_folder = "static/combined_chunks"
        
        os.makedirs(output_folder, exist_ok=True)
        os.makedirs(video_folder, exist_ok=True)
        os.makedirs(audio_folder, exist_ok=True)
        
        video_files = sorted([f for f in os.listdir(video_folder) if f.startswith('chunk_') and f.endswith('.mp4')])
        audio_files = sorted([f for f in os.listdir(audio_folder) if f.startswith('video_') and f.endswith('.wav')])
        
        if not audio_files:
            print("No audio files found!")
            return
        
        for i, video_file in enumerate(video_files):
            video_path = os.path.join(video_folder, video_file)
            audio_index = i % len(audio_files)
            audio_file = audio_files[audio_index]
            audio_path = os.path.join(audio_folder, audio_file)
            
            output_file = f"{video_file}"
            output_path = os.path.join(output_folder, output_file)
            
            video_duration = get_duration(video_path)
            audio_duration = get_duration(audio_path)
            
            print(f"Processing: {video_file} with {audio_file}")
            print(f"Video duration: {video_duration}, Audio duration: {audio_duration}")
            
            if audio_duration > video_duration:
                filter_complex = f"[1:a]atempo={audio_duration/video_duration}[a]"
                cmd = [
                    'ffmpeg', '-i', video_path, '-i', audio_path,
                    '-filter_complex', filter_complex, '-map', '0:v', '-map', '[a]',
                    '-c:v', 'copy', '-c:a', 'aac', '-shortest', output_path
                ]
            elif audio_duration < video_duration:
                if video_duration / audio_duration > 2:
                    filter_complex = f"[1:a]aloop=loop=-1:size=2s[a]"
                    cmd = [
                        'ffmpeg', '-i', video_path, '-i', audio_path,
                        '-filter_complex', filter_complex, '-map', '0:v', '-map', '[a]',
                        '-c:v', 'copy', '-c:a', 'aac', '-shortest', output_path
                    ]
                else:
                    tempo_factor = video_duration / audio_duration
                    if tempo_factor <= 2.0:
                        filter_complex = f"[1:a]atempo={tempo_factor}[a]"
                    else:
                        atempo_chain = []
                        remaining = tempo_factor
                        while remaining > 2.0:
                            atempo_chain.append("atempo=2.0")
                            remaining /= 2.0
                        atempo_chain.append(f"atempo={remaining}")
                        filter_complex = f"[1:a]{','.join(atempo_chain)}[a]"
                    
                    cmd = [
                        'ffmpeg', '-i', video_path, '-i', audio_path,
                        '-filter_complex', filter_complex, '-map', '0:v', '-map', '[a]',
                        '-c:v', 'copy', '-c:a', 'aac', '-t', str(video_duration), output_path
                    ]
            else:
                cmd = [
                    'ffmpeg', '-i', video_path, '-i', audio_path,
                    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', output_path
                ]
            
            print(f"Running command: {' '.join(cmd)}")
            subprocess.run(cmd)
            print(f"Created: {output_path}")

    process_files()

if __name__ == "__main__":
    combine()
