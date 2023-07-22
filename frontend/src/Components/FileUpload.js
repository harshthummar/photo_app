import Form from "react-bootstrap/Form";
import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { getToken } from "../utils/helper";
import "../style/FileUpload.css";

export default function FileUpload() {
  const [Image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const maxSize = 3 * 1024 * 1024; // 3 MB (in bytes)
      if (file.size <= maxSize) {
        setImage(file);
      }
    } else {
      setImage(null);
      alert("Please select an image file.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Image) {
      alert("Please select an image file.");
      return;
    }
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", Image);
    try {
      const authToken = getToken();
      await axios.post("http://localhost:4000/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setImage(null);
      console.log("Image uploaded successfully:");
    } catch (error) {
      alert("Image is already there");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.error("Error uploading image:", error.message);
    }
  };

  return (
    <>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload Image</Form.Label>
        <Form.Control type="file" ref={fileInputRef} onChange={handleChange} />
        <br></br>
        <Button onClick={handleSubmit}>Add Image</Button>
      </Form.Group>
    </>
  );
}
