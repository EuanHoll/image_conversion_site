from flask import Flask, request, send_file, send_from_directory, Response
from PIL import Image
import os
from io import BytesIO


# Getting Directories
parent_folder = os.path.dirname(os.path.abspath(__file__))
directory = os.path.abspath(
    os.path.join(parent_folder, "..", "image_conversion_frontend", "build")
)

# Setting flask app
app = Flask(__name__, static_folder=directory, static_url_path="")


@app.route("/convert", methods=["POST"])
def convert_image_format():
    # Get the input and output format from the request parameters
    input_format = request.form["input_format"]
    output_format = request.form["output_format"]

    # Get the input image from the request
    input_image = request.files["input_image"]
    # input_image.seek(0)

    # Open the input image
    image = Image.open(input_image)

    # Create a BytesIO object to hold the output image
    output_image = BytesIO()

    # Save the image to the output buffer
    image.save(output_image, format=output_format)

    # Reset the buffer's position to the start
    output_image.seek(0)

    # Set the response headers
    response_headers = {
        "Content-Disposition": f"attachment; filename=output_image.{output_format}",
        "Content-Type": f"image/{output_format}",
    }

    # Create a response object with the desired headers
    response = Response(output_image, headers=response_headers)

    # Return the response
    return response


@app.route("/")
def index():
    # Return the directory contents as a response
    return send_from_directory(directory, "index.html")


if __name__ == "__main__":
    app.run(debug=True)
