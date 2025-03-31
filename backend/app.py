import os
from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS
from original_subs import generate_subs  # Importing generate_subs function
from embed_subtitles import embeded_sub
from create_chunks import chunk_original_video
from convert_to_wav import extract_audio
from generate_audio import generate_audio
from combine_audio_video_chunks import combine
from combine_all_chunks import combine_all
from language_map_end import final_conversion
import sys


print("Starting application...")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")

from flask import Flask, request, jsonify, Response, send_from_directory
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = os.path.join('static', 'processed_video')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_video():
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file uploaded'}), 400
        
        upload_path = os.path.join(UPLOAD_FOLDER, 'uploaded_video.mp4')
        file.save(upload_path)
        print(f"File saved to {upload_path}")
        
        try:
            print("Calling generate_subs...")
            generate_subs("uploaded_video.mp4")
            extract_audio()
            print("extracted audio to wav")
            generate_audio()
            print("generate_subs completed successfully!")
            chunk_original_video()
            print("chunking video completed successfully!")
            combine()
            print("combined audio files with video")
            


            print("generated chunks successfully!")
        except Exception as e:
            print(f"Error in generate_subs: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': f'Subtitle generation failed: {str(e)}'}), 500
        
        try:
            combine_all()
            print("done???")
            final_conversion()
            print("now maybe?")
            # print("Calling embeded_sub...")
            embeded_sub()
            # print("embeded_sub completed successfully!")
        except Exception as e:
            print(f"Error in embeded_sub: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': f'Subtitle embedding failed: {str(e)}'}), 500
        
        print("All processing completed successfully.")
        return jsonify({'message': 'File uploaded successfully and subtitles generated and embedded.'})
    except Exception as e:
        print(f"Error in upload_video: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/stream/<role>')
def stream_video(role):
    def generate():
        try:
            if role == 'host':
                video_url = f"http://localhost:5000/uploads/uploaded_video2.mp4"
            else:
                video_url = f"http://localhost:5000/static/processed_video/processed_video2.mp4"
            yield f"data: {video_url}\n\n"
        except Exception as e:
            yield f"data: error: {str(e)}\n\n"
    return Response(generate(), mimetype='text/event-stream')

@app.route('/current_video')
def current_video():
    video_url = f"http://localhost:5000/uploads/uploaded_video.mp4"
    return jsonify({'current_video': video_url})

if __name__ == '__main__':
    try:
        print("Starting Flask app...")
        app.run(debug=True)
    except Exception as e:
        print(f"Critical error in Flask app: {e}")
        import traceback
        traceback.print_exc()
        import sys
        sys.exit(1)