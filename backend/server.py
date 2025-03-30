from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from original_subs import generate_subs
from embed_subtitles import  embed_subtitles
import os
app = Flask(__name__)
CORS(app)

# if __name__ == '__main__':
#     app.run(debug=True)

filename = "test.mp4"

import glob

upload_folder = "upload/original_subtitles"
file_type = "*.srt"  # Change to "*.csv", "*.jpg", etc.




generate_subs(filename)
files = glob.glob(os.path.join(upload_folder, file_type))
if files:
    latest_file = max(files, key=os.path.getmtime)
    embed_subtitles(filename, latest_file, "immalkms.mp4")

