from flask import Flask, request, send_file
from flask_cors import CORS
from pypdf import PdfReader, PdfWriter
import os

app = Flask(__name__)
CORS(app)


@app.route("/merge", methods=["POST"])
def merge():

    files = request.files.getlist("pdfs")
    filename = request.form.get("filename", "merged")

    writer = PdfWriter()

    for file in files:

        reader = PdfReader(file)

        for page in reader.pages:
            writer.add_page(page)

    output = filename + ".pdf"

    with open(output, "wb") as f:
        writer.write(f)

    return send_file(
        output,
        as_attachment=True,
        download_name=output
    )


if __name__ == "__main__":
    app.run(debug=True)