from flask import Flask, request, send_file, send_from_directory
from PIL import Image

app = Flask(__name__)


@app.route("/convert", methods=["POST"])
def convert_image_format():
    # Get the input and output format from the request parameters
    input_format = request.form["input_format"]
    output_format = request.form["output_format"]

    # Get the input image from the request
    input_image = request.files["input_image"]
    input_image.seek(0)

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

    # Return the output image as a response
    return send_file(output_image, headers=response_headers, as_attachment=True)


@app.route("/")
def index():
    # Set the directory to host
    directory = "/path/to/directory"
    # Set the file to serve as the default index
    index = "index.html"
    # Return the directory contents as a response
    return send_from_directory(directory, index)


if __name__ == "__main__":
    app.run()
