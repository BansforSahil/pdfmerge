from flask import Flask, request, send_file
from flask_cors import CORS
from pypdf import PdfReader, PdfWriter
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "PDF Merger Backend is Running 🚀"

@app.route("/merge", methods=["POST"])
def merge():

    files = request.files.getlist("pdfs")

    if len(files) == 0:
        return "No PDF files received.", 400

    filename = request.form.get("filename", "merged")

    writer = PdfWriter()

    for file in files:
        reader = PdfReader(file)

        for page in reader.pages:
            writer.add_page(page)

    output_file = f"{filename}.pdf"

    with open(output_file, "wb") as f:
        writer.write(f)

    return send_file(
        output_file,
        as_attachment=True,
        download_name=output_file,
        mimetype="application/pdf"
    )


if __name__ == "__main__":
    app.run(debug=True)