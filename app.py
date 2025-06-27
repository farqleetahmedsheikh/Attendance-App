# from flask import Flask, request, jsonify
# import face_recognition
# import os

# app = Flask(__name__)

# def is_face_match_cpu(known_image_path, test_image_path):
#     try:
#         known_image = face_recognition.load_image_file(known_image_path)
#         known_face_locations = face_recognition.face_locations(known_image, model="hog")
#         known_face_encodings = face_recognition.face_encodings(known_image, known_face_locations)

#         if not known_face_encodings:
#             return False, "No face found in known image."
#         known_encoding = known_face_encodings[0]

#         test_image = face_recognition.load_image_file(test_image_path)
#         test_face_locations = face_recognition.face_locations(test_image, model="hog")
#         test_face_encodings = face_recognition.face_encodings(test_image, test_face_locations)

#         if not test_face_encodings:
#             return False, "No face found in test image."
#         test_encoding = test_face_encodings[0]

#         result = face_recognition.compare_faces([known_encoding], test_encoding)
#         return result[0], "Face matched" if result[0] else "Face did not match"
#     except Exception as e:
#         return False, str(e)

# @app.route('/match', methods=['POST'])
# def match_faces():
#     if 'known' not in request.files or 'test' not in request.files:
#         return jsonify({"error": "Please upload both 'known' and 'test' images"}), 400

#     known = request.files['known']
#     test = request.files['test']

#     known_path = os.path.join("known.jpg")
#     test_path = os.path.join("test.jpg")

#     known.save(known_path)
#     test.save(test_path)

#     result, message = is_face_match_cpu(known_path, test_path)

#     # Clean up files
#     os.remove(known_path)
#     os.remove(test_path)

#     return jsonify({
#         "matched": result,
#         "message": message
#     })

# # if __name__ == '__main__':
# #     app.run(debug=True)

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import os

# app = Flask(_name)  # ✅ Fixed __name_
app = Flask(__name__)
CORS(app)
def is_face_match_cpu(known_image_path, test_image_path):
    try:
        # Load known image
        known_image = face_recognition.load_image_file(known_image_path)
        known_face_locations = face_recognition.face_locations(known_image, model="hog")
        known_face_encodings = face_recognition.face_encodings(known_image, known_face_locations)

        if not known_face_encodings:
            return False, "No face found in known image."

        known_encoding = known_face_encodings[0]

        # Load test image
        test_image = face_recognition.load_image_file(test_image_path)
        test_face_locations = face_recognition.face_locations(test_image, model="hog")
        test_face_encodings = face_recognition.face_encodings(test_image, test_face_locations)

        if not test_face_encodings:
            return False, "No face found in test image."

        test_encoding = test_face_encodings[0]

        # Compare faces
        result_list = face_recognition.compare_faces([known_encoding], test_encoding)
        result = bool(result_list[0])  # Ensure it's a plain bool for JSON

        return result, "Face matched" if result else "Face did not match"

    except Exception as e:
        return False, f"Error: {str(e)}"

@app.route('/match', methods=['POST'])
def match_faces():
    if 'known' not in request.files or 'test' not in request.files:
        return jsonify({"error": "Please upload both 'known' and 'test' images"}), 400

    known = request.files['known']
    test = request.files['test']

    known_path = "known.jpg"
    test_path = "test.jpg"

    try:
        # Save files
        known.save(known_path)
        test.save(test_path)

        # Run face match
        result, message = is_face_match_cpu(known_path, test_path)

        return jsonify({
            "matched": result,
            "message": message
        })

    finally:
        # Clean up files
        if os.path.exists(known_path):
            os.remove(known_path)
        if os.path.exists(test_path):
            os.remove(test_path)

# if __name__ == '__main__':
#     app.run(debug=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)