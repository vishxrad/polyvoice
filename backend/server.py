from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from original_subs import generate_subs
# from embed_subtitles import  embed_subtitles
import os
app = Flask(__name__)
CORS(app)

# if __name__ == '__main__':
#     app.run(debug=True)

filename = "uploaded_video.mp4"



generate_subs("uploaded_video.mp4")


