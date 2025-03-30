import time, os, shutil
from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS
from moviepy import VideoFileClip, vfx

app = Flask(__name__)
CORS(app)

# Define folders for uploads and processed video
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = os.path.join('static', 'processed_video')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

def process_video_with_moviepy(input_path, output_path):
    """
    Process the full video for joiners using MoviePy.
    This applies transformations like resolution reduction and a darkening effect.
    """
    try:
        video = VideoFileClip(input_path)
        processed_video = video.resize(0.5)  # Reduce resolution to 50%
        processed_video = processed_video.fx(vfx.colorx, 0.8)  # Slight darkening effect
        processed_video.write_videofile(output_path, codec='libx264', audio_codec='aac')
        video.close()
        processed_video.close()
        return output_path
    except Exception as e:
        print(f"Error in processing video: {e}")
        shutil.copyfile(input_path, output_path)
        return output_path

@app.route('/upload', methods=['POST'])
def upload_video():
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file uploaded'}), 400
        
        # Save the uploaded file (original video)
        upload_path = os.path.join(UPLOAD_FOLDER, 'uploaded_video.mp4')
        file.save(upload_path)
        print(f"File saved to {upload_path}")
        
        # Process the full video to create an edited version for joiners
        processed_path = os.path.join(PROCESSED_FOLDER, 'processed_video.mp4')
        process_video_with_moviepy(upload_path, processed_path)
        print(f"Processed video saved to {processed_path}")
        
        return jsonify({
            'message': 'File uploaded and processed. Streaming will start shortly.'
        })
    except Exception as e:
        print(f"Error in upload_video: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Optional route to serve uploaded files if needed
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/stream/<role>')
def stream_video(role):
    def generate():
        try:
            if role == 'host':
                # Send the original full video URL to the host.
                video_url = f"http://localhost:5000/uploads/uploaded_video.mp4"
            else:
                # Send the processed video URL to joiners.
                video_url = f"http://localhost:5000/static/processed_video/processed_video.mp4"
            yield f"data: {video_url}\n\n"
        except Exception as e:
            yield f"data: error: {str(e)}\n\n"
    return Response(generate(), mimetype='text/event-stream')

@app.route('/current_video')
def current_video():
    # Returns the URL for the original video (for compatibility).
    video_url = f"http://localhost:5000/uploads/uploaded_video.mp4"
    return jsonify({'current_video': video_url})

if __name__ == '__main__':
    app.run(debug=True)
