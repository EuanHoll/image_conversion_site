import React from "react";
import { Form, Select, Upload, Button } from "antd";
import "./App.css";
import { InboxOutlined } from "@ant-design/icons";

const { Option } = Select;

async function convertFile(file, inputFormat, outputFormat) {
  try {
    // Create a FormData object to hold the request body data
    const formData = new FormData();
    formData.append("input_format", inputFormat);
    formData.append("output_format", outputFormat);
    formData.append("input_image", file);

    // Send a POST request to the /convert endpoint with the FormData object as the request body
    const response = await fetch("/convert", {
      method: "POST",
      body: formData,
    });

    // Return the output image as a blob
    return await response.blob();
  } catch (error) {
    console.error(error);
  }
}

class App extends React.Component {
  state = {
    file: null,
    inputFormat: "",
    outputFormat: "",
  };

  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
    // Set the input format based on the file extension
    this.setState({ inputFormat: event.target.files[0].name.split(".").pop() });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    // Convert the file using the /convert endpoint
    convertFile(
      this.state.file,
      this.state.inputFormat,
      this.state.outputFormat
    ).then((outputImage) => {
      // Do something with the output image
      console.log(outputImage);
    });
  };

  render() {
    return (
      <div>
        <div class="top-center">
          <h1>Image Converter</h1>
        </div>
        <div class="center">
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="Output format">
              <Select
                value={this.state.outputFormat}
                onChange={(value) => this.setState({ outputFormat: value })}
                defaultValue={"png"}
                style={{ width: "120px" }}>
                <Option value="png">PNG</Option>
                <Option value="jpg">JPG</Option>
                <Option value="gif">ICO</Option>
                <Option value="bmp">BMP</Option>
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
