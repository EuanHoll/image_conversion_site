import React from "react";
import { Form, Select, Upload, Button, message } from "antd";
import "./App.css";
import { InboxOutlined } from "@ant-design/icons";

const { Option } = Select;

async function convertFile(file, inputFormat, outputFormat) {
  try {
    // Create a FormData object to hold the request body data
    const formData = new FormData();
    formData.append("input_format", inputFormat);
    formData.append("output_format", outputFormat);

    // Create a Blob object from the file
    const fileBlob = new Blob([file], { type: file.type });
    formData.append("input_image", fileBlob, file.name);

    // Send a POST request to the /convert endpoint with the FormData object as the request body
    const response = await fetch("/convert", {
      method: "POST",
      body: formData,
      credentials: "same-origin", // include cookies in the request
    });

    // Check if the response is a file (blob)
    if (!response.ok) {
      message.error("Error: Failed to convert image");
      throw new Error("Error: Failed to convert image");
    }

    // Download the output image as a blob
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "converted." + outputFormat; // Set the desired name for the downloaded file
    link.click();
  } catch (error) {
    console.error(error);
  }
}

class App extends React.Component {
  state = {
    file: null,
    inputFormat: "unused",
    outputFormat: "",
  };

  handleFileChange = (event) => {
    this.setState({ file: event.file.originFileObj });
    // Set the input format based on the file extension
    this.setState({ inputFormat: event.file.name.split(".").pop() });
  };

  handleSubmit = (event) => {
    // Convert the file using the /convert endpoint
    convertFile(
      this.state.file,
      this.state.inputFormat,
      this.state.outputFormat
    );
  };

  render() {
    document.title = "Convert Image";
    return (
      <div>
        <div className="top-center">
          <h1>Image Converter</h1>
        </div>
        <div className="center">
          <Form onFinish={this.handleSubmit}>
            <Form.Item label="Output format">
              <Select
                value={this.state.outputFormat}
                onChange={(value) => this.setState({ outputFormat: value })}
                defaultValue={"png"}
                style={{ width: "120px" }}>
                <Option value="png">PNG</Option>
                <Option value="jpg">JPG</Option>
                <Option value="ico">ICO</Option>
                <Option value="bmp">BMP</Option>
                <Option value="tiff">TIFF</Option>
                <Option value="tga">TGA</Option>
              </Select>
            </Form.Item>
            <Form.Item label="File">
              <Upload showUploadList={false} onChange={this.handleFileChange}>
                <Button style={{ width: "140px", height: "40px" }}>
                  <InboxOutlined />
                  Choose a file
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Convert
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default App;
