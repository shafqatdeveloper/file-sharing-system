import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "./pdf-worker";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Loaders/Loader";

function Uploader({ id }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth * 0.9);
  console.log(id);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth * 0.9);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file.type === "application/pdf") {
      setSelectedFile(file);
      setFileUrl(URL.createObjectURL(file));
      setNumPages(null);
    } else if (
      file.type.startsWith("image/") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setLoading(true);
      const formData = new FormData();
      formData.append("receivedFile", file);

      const response = await axios.post("/api/file/convert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });
      console.log(response.data);
      const newFile = new File([response.data], "convertedFile.pdf");

      setSelectedFile(newFile);
      const url = URL.createObjectURL(response.data);
      setFileUrl(url);
      setLoading(false);
      setNumPages(null);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("folderId", id);
    formData.append("uploadedFile", selectedFile);
    const response = await axios.post("/api/upload/document", formData);
    if (response.status === 200) {
      toast(response.data.message);
      setFileUrl(null);
      setSelectedFile(null);
    } else {
      toast(response.data.message);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <input
        type="file"
        accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleFileUpload}
        className="px-5 py-1 bg-green-500 rounded-md"
      >
        Upload
      </button>
      {loading && <Loader />}
      {fileUrl && (
        <Document
          loading={<Loader />}
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="my-2">
              <Page pageNumber={index + 1} width={width} />
            </div>
          ))}
        </Document>
      )}
    </div>
  );
}

export default Uploader;
